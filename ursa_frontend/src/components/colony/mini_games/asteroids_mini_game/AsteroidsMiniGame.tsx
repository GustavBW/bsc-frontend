import { Component, createSignal, onMount, onCleanup, For } from "solid-js";
import { css } from "@emotion/css";
import {
  ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT,
  ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT,
  ASTEROIDS_ASTEROID_SPAWN_EVENT,
  ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT,
  AsteroidsAssignPlayerDataMessageDTO,
  AsteroidsAsteroidSpawnMessageDTO,
  AsteroidsPlayerShootAtCodeMessageDTO,
  PLAYER_READY_FOR_MINIGAME_EVENT,
} from "../../../../integrations/multiplayer_backend/EventSpecifications";
import { createArrayStore } from "../../../../ts/arrayStore";
import { ActionContext, BufferSubscriber, TypeIconTuple } from "../../../../ts/actionContext";
import { createWrappedSignal } from "../../../../ts/wrappedSignal";
import ActionInput from "../../MainActionInput";
import BufferBasedButton from "../../../BufferBasedButton";
import { MinigameProps } from "../miniGame";
import { uint32 } from "../../../../integrations/main_backend/mainBackendDTOs";
import Countdown from "../../../util/Countdown";
import StarryBackground from "../../../StarryBackground";
import NTAwait from "../../../util/NoThrowAwait";
import GraphicalAsset from "../../../GraphicalAsset";

/**
 * Settings DTO for the Asteroids minigame.
 * All time values are in seconds unless specified otherwise.
 */
export type AsteroidsSettingsDTO = {
    minTimeTillImpactS: number,      // Minimum time for asteroid to reach impact point
    maxTimeTillImpactS: number,      // Maximum time for asteroid to reach impact point
    charCodeLength: uint32,          // Length of character codes for shooting
    asteroidsPerSecondAtStart: number, // Initial spawn rate
    asteroidsPerSecondAt80Percent: number, // Spawn rate at 80% game completion
    colonyHealth: uint32,            // Starting health of the colony
    asteroidMaxHealth: uint32,       // Maximum possible health of asteroids
    stunDurationS: number,           // How long players remain stunned
    friendlyFirePenaltyS: number,    // Base friendly fire penalty duration
    friendlyFirePenaltyMultiplier: number, // Multiplier for consecutive friendly fire
    timeBetweenShotsS: number,       // Cooldown between shots
    survivalTimeS: number,           // Total game duration
    spawnRateCoopModifier: number    // Modifier for spawn rate in cooperative mode
}

/**
 * Extended asteroid data including visual and gameplay properties
 */
interface Asteroid extends AsteroidsAsteroidSpawnMessageDTO {
  speed: number,          // Movement speed (milliseconds)
  destroy: () => void,    // Function to handle asteroid destruction
  endX: number,          // Final X position (0.0 for wall)
  endY: number           // Final Y position (0.5 for center)
}

/**
 * Extended player data including status effects and their handlers
 */
interface Player extends AsteroidsAssignPlayerDataMessageDTO {
  isStunned: boolean,    // Whether player is currently stunned
  isDisabled: boolean,   // Whether player is currently disabled
  stun: () => void,      // Function to apply stun effect
  disable: () => void,   // Function to apply disable effect
}

/**
 * Data structure for laser beam visual effects
 */
interface LazerBeam {
  startX: number,       // Beam start X coordinate
  startY: number,       // Beam start Y coordinate
  endX: number,        // Beam end X coordinate
  endY: number,        // Beam end Y coordinate
  opacity: number,     // Current opacity for fade effect
}

/**
 * Main Asteroids minigame component
 */
const AsteroidsMiniGame: Component<MinigameProps<AsteroidsSettingsDTO>> = (props) => {
  // State Management
  const asteroids = createArrayStore<Asteroid>();
  const players = createArrayStore<Player>();
  const asteroidsRemoveFuncs = new Map<uint32, () => void>();
  const [health, setHealth] = createSignal(props.settings.colonyHealth);

  // Input and UI State
  const inputBuffer = createWrappedSignal<string>('');
  const bufferSubscribers = createArrayStore<BufferSubscriber<string>>();
  const actionContext = createWrappedSignal<TypeIconTuple>(ActionContext.ASTEROIDS);
  
  // Player Status States
  const [isStunned, setIsStunned] = createSignal<boolean>(false);
  const [isDisabled, setIsDisabled] = createSignal<boolean>(false);
  const [buttonsEnabled, setButtonsEnabled] = createSignal<boolean>(true); // Changed from disableButtons
  const lazerBeams = createArrayStore<LazerBeam>();

  // Timers for status effects
  let stunTimer: NodeJS.Timeout;
  let penaltyTimer: NodeJS.Timeout;
  let buttonDisableTimer: NodeJS.Timeout;

  /**
   * Handles the destruction of an asteroid by its ID
   * Cleans up the asteroid and its removal function
   */
  const handleAsteroidDestruction = (asteroidID: number) => {
    const removeFunc = asteroidsRemoveFuncs.get(asteroidID);
    if (removeFunc) {
      removeFunc();
      asteroidsRemoveFuncs.delete(asteroidID);
    }
  };

  /**
   * Handles local player shooting at a specific character code
   * Emits event and processes the shot locally
   */
  const localPlayerShootAtCodeHandler = (charCode: string) => {
    if (charCode) {
      props.context.events.emit(ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT, {
        id: props.context.backend.localPlayer.id,
        code: charCode
      });

      handlePlayerShootAtCodeEvent({
        id: props.context.backend.localPlayer.id,
        code: charCode,
        senderID: props.context.backend.localPlayer.id,
        eventID: ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT.id,
      });
    }
  };

  /**
   * Processes a player's shot, handling hits on players or asteroids
   * Creates visual effects and applies relevant status effects
   */
  const handlePlayerShootAtCodeEvent = (data: AsteroidsPlayerShootAtCodeMessageDTO) => {
    const shooter = players.findFirst((p) => p.id === data.id);

    if (shooter) {
      const hitPlayers = players.findAll((p) => p.code === data.code);
      if (!hitPlayers.length) {
        hitPlayers.forEach((p) => {
          spawnLazerBeam(shooter.x, shooter.y, p.x, p.y);
          p.stun();
        });
        shooter.disable();
      }

      const hitAsteroids = asteroids.findAll((a) => a.charCode === data.code);
      if (!hitAsteroids.length) {
        hitAsteroids.forEach((a) => {
          spawnLazerBeam(shooter.x, shooter.y, a.x, a.y);
          a.destroy();
        });
      }

      if (!hitPlayers.length && !hitAsteroids.length) {
        spawnLazerBeam(
          shooter.x,
          shooter.y,
          (Math.random() + 1) * window.innerWidth,
          (Math.random() + 1) * window.innerHeight
        );
      }
    }
  };

  /**
   * Handles disabling buttons for a player for a specified duration
   * Only affects the local player
   */
  const disableButtonsHandler = (data: AsteroidsAssignPlayerDataMessageDTO, time: number) => {
    if (data.id === props.context.backend.localPlayer.id) {
      clearTimeout(buttonDisableTimer);
      setButtonsEnabled(false); // Changed from setDisableButtons(true)

      buttonDisableTimer = setTimeout(() => {
        setButtonsEnabled(true); // Changed from setDisableButtons(false)
        clearTimeout(buttonDisableTimer);
      }, time);
    }
  };

  /**
   * Creates a new laser beam visual effect
   */
  const spawnLazerBeam = (shooterX: number, shootery: number, targetX: number, targetY: number) => {
    const newBeam: LazerBeam = {
      startX: shooterX,
      startY: shootery,
      endX: targetX,
      endY: targetY,
      opacity: 1,
    };
    lazerBeams.add(newBeam);
  };

  // Component Lifecycle and Event Subscriptions
  onMount(() => {
    // Update laser beam fade effects
    const updateLazerBeams = setInterval(() => {
      lazerBeams.mutateByPredicate(
        (beam) => beam.opacity > 0,
        (beam) => ({ ...beam, opacity: beam.opacity - 0.1 })
      );
    
      const beamsToRemove = lazerBeams.findAll((beam) => beam.opacity <= 0);
      beamsToRemove.forEach((beam) => {
        const removeBeam = lazerBeams.add(beam);
        removeBeam();
      });
    }, 100);

    // Event Subscriptions
    const spawnSubID = props.context.events.subscribe(ASTEROIDS_ASTEROID_SPAWN_EVENT, (data) => {
      const removeFunc = asteroids.add({
        ...data,
        speed: data.timeUntilImpact,
        endX: 0.0,
        endY: 0.5,
        destroy: () => handleAsteroidDestruction(data.id)
      });
      asteroidsRemoveFuncs.set(data.id, removeFunc);
    });

    const asteroidImpactSubID = props.context.events.subscribe(ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT, (data) => {
      setHealth(data.colonyHPLeft);
      handleAsteroidDestruction(data.id);
    });

    const loadPlayerDataSubID = props.context.events.subscribe(ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT, (data) => {
      players.add({
        ...data,
        isStunned: false,
        isDisabled: false,
        stun: () => {
          clearTimeout(stunTimer);
          players.mutateByPredicate(
            (p) => p.id === data.id,
            (p) => ({ ...p, isStunned: true })
          );
          disableButtonsHandler(data, props.settings.stunDurationS);
          stunTimer = setTimeout(() => {
            players.mutateByPredicate(
              (p) => p.id === data.id,
              (p) => ({ ...p, isStunned: false })
            );
            clearTimeout(stunTimer);
          }, props.settings.stunDurationS);
        },
        disable: () => {
          clearTimeout(penaltyTimer);
          players.mutateByPredicate(
            (p) => p.id === data.id,
            (p) => ({ ...p, isDisabled: true })
          );
          disableButtonsHandler(
            data,
            props.settings.friendlyFirePenaltyS * props.settings.friendlyFirePenaltyMultiplier
          );
          penaltyTimer = setTimeout(() => {
            players.mutateByPredicate(
              (p) => p.id === data.id,
              (p) => ({ ...p, isDisabled: false })
            );
            clearTimeout(penaltyTimer);
          }, props.settings.friendlyFirePenaltyS * props.settings.friendlyFirePenaltyMultiplier);
        }
      });
    });

    const playerShootSubID = props.context.events.subscribe(ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT, handlePlayerShootAtCodeEvent);

    props.context.events.emit(PLAYER_READY_FOR_MINIGAME_EVENT, {
      id: props.context.backend.localPlayer.id,
      ign: props.context.backend.localPlayer.firstName,
    });

    onCleanup(() => {
      props.context.events.unsubscribe(spawnSubID, asteroidImpactSubID, loadPlayerDataSubID, playerShootSubID);
      clearInterval(updateLazerBeams);
    });
  });

  // Component Render
  return (
    <div>
      <StarryBackground />
      <div class={wallStyle} id="Outer-Wall"/>
      <div class={statusStyle}>
        Health: {'❤'.repeat(health())}
      </div>
      <Countdown duration={props.settings.survivalTimeS}/>
      <div>
        {/* Asteroid Rendering */}
        <For each={asteroids.get}>
          {(asteroid) => (
            <div
              class={asteroidStyle}
              ref={(el: HTMLDivElement) => {
                if (el) {
                  // Initialize position without transition
                  el.style.transition = 'none';
                  el.style.left = `${asteroid.x * 100}%`;
                  el.style.top = `${asteroid.y * 100}%`;
                  
                  // Force browser reflow for clean animation
                  void el.offsetHeight;

                  // Start animation to impact point
                  requestAnimationFrame(() => {
                    el.style.transition = `all ${asteroid.timeUntilImpact / 1000}s linear`;
                    el.style.left = '0%';
                    el.style.top = '50%';
                  });
                }
              }}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <NTAwait func={() => props.context.backend.getAssetMetadata(7001)}>
                {(asset) => (
                  <GraphicalAsset metadata={asset} backend={props.context.backend}/>
                )}
              </NTAwait>
              <BufferBasedButton
                enable={buttonsEnabled} // Changed from disableButtons
                name={asteroid.charCode}
                buffer={inputBuffer.get}
                onActivation={() => localPlayerShootAtCodeHandler(asteroid.charCode)}
                register={bufferSubscribers.add}
              />
            </div>
          )}
        </For>

        {/* Laser Beams Rendering */}
        <For each={lazerBeams.get}>
          {(beam) => (
            <>
              <div
                class={lazerBeamStyle}
                style={{
                  left: `${beam.startX}px`,
                  top: `${beam.startY}px`,
                  width: `${Math.hypot(beam.endX - beam.startX, beam.endY - beam.startY)}px`,
                  transform: `rotate(${Math.atan2(beam.endY - beam.startY, beam.endX - beam.startX)}rad)`,
                  opacity: beam.opacity,
                }}
              />
              <div
                class={impactCircleStyle}
                style={{
                  left: `${beam.endX}px`,
                  top: `${beam.endY}px`,
                  opacity: beam.opacity,
                }}
              />
            </>
          )}
        </For>

        {/* Player Rendering */}
        <For each={players.get}>
          {(player) => (
            <div
              class={playerStyle}
              style={{
                left: `${player.x * 100}%`,
                top: `${player.y * 100}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              <NTAwait func={() => props.context.backend.getAssetMetadata(7002)}>
                {(asset) => (
                  <GraphicalAsset metadata={asset} backend={props.context.backend} />
                )}
              </NTAwait>
              <BufferBasedButton
                enable={buttonsEnabled} // Changed from disableButtons
                name={player.code}
                buffer={inputBuffer.get}
                onActivation={() => localPlayerShootAtCodeHandler(player.code)}
                register={bufferSubscribers.add}
              />
              {player.isStunned && <div class={stunnedStyle} />}
              {player.isDisabled && <div class={disabledStyle} />}
            </div>
          )}
        </For>

        {/* Action Input */}
        <ActionInput
          subscribers={bufferSubscribers}
          text={props.context.text}
          backend={props.context.backend}
          actionContext={actionContext.get}
          setInputBuffer={inputBuffer.set}
          inputBuffer={inputBuffer.get}
        />
      </div>
    </div>
  );
};

export default AsteroidsMiniGame;

// Styles

const wallStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 1vw;
  height: 100vh;
  background: linear-gradient(to right, #4a4a4a, #bebebe);
  overflow: hidden;
`;

const asteroidStyle = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const statusStyle = css`
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 18px;
`;

const lazerBeamStyle = css`
  position: absolute;
  height: 2px;
  transform-origin: left center;
  background: linear-gradient(
    to right,
    rgba(255, 0, 0, 0.5),
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 0, 0, 0.5)
  );
`;

const impactCircleStyle = css`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 0, 0, 1) 50%,
    rgba(255, 0, 0, 0) 100%
  );
`;

const playerStyle = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const stunnedStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: radial-gradient(ellipse at center, rgba(173,216,230,0.5) 0%, rgba(173,216,230,0) 70%);
    border-radius: 50%;
    animation: smoke 3s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.9; }
    100% { transform: scale(0.95); opacity: 0.7; }
  }

  @keyframes smoke {
    0% { transform: translateY(0) scale(1); opacity: 0.3; }
    100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
  }
`;

const disabledStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    background: radial-gradient(ellipse at center, rgba(255,69,0,0.5) 0%, rgba(255,69,0,0) 70%);
    border-radius: 50%;
    animation: flicker 0.5s infinite alternate;
  }

  @keyframes flicker {
    0% { opacity: 0.5; transform: scale(0.98); }
    100% { opacity: 0.8; transform: scale(1.02); }
  }
`;