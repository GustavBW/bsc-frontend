import { Component, createEffect, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { ApplicationContext } from "../../src/meta/types";
import { IBackendBased, IInternationalized, IStyleOverwritable } from "../../src/ts/types";
import { createWrappedSignal } from "../../src/ts/wrappedSignal";
import { createArrayStore } from "../../src/ts/arrayStore";
import { ActionContext, BufferSubscriber } from "../../src/ts/actionContext";
import { PLAYER_MOVE_EVENT } from "../../src/integrations/multiplayer_backend/EventSpecifications";
import { css } from "@emotion/css";
import StarryBackground from "../../src/components/base/StarryBackground";
import BufferBasedButton from "../../src/components/base/BufferBasedButton";
import ActionInput from "../../src/components/colony/MainActionInput";
import NTAwait from "../../src/components/util/NoThrowAwait";
import GraphicalAsset from "../../src/components/base/GraphicalAsset";
import { Position } from "../../src/components/colony/mini_games/asteroids_mini_game/entities/BaseEntity";

export const EXPECTED_WIDTH = 1920;
export const EXPECTED_HEIGHT = 1080;

interface NavigationTrialProps extends IBackendBased, IInternationalized, IStyleOverwritable {
    onSlideCompleted: () => void;
    context: ApplicationContext;
}

interface EntityRef {
    type: "location";
    element: HTMLElement;
}

const MOCK_LOCATIONS = [
    { id: 1, name: 'HOME', transform: { xOffset: 960, yOffset: 540, xScale: 1, yScale: 1, zIndex: 1 } },
    { id: 2, name: 'SHOP', transform: { xOffset: 1440, yOffset: 270, xScale: 1, yScale: 1, zIndex: 1 } },
    { id: 3, name: 'PARK', transform: { xOffset: 480, yOffset: 810, xScale: 1, yScale: 1, zIndex: 1 } },
    { id: 4, name: 'LIBRARY', transform: { xOffset: 1440, yOffset: 810, xScale: 1, yScale: 1, zIndex: 1 } }
];

const MOCK_PATHS = [
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
    { from: 4, to: 1 }, { from: 1, to: 3 }, { from: 2, to: 4 }
];

const NavigationTrial: Component<NavigationTrialProps> = (props) => {
    const [layoutComplete, setLayoutComplete] = createSignal(false);
    const pathStore = createArrayStore(MOCK_PATHS);
    const worldOffset = createWrappedSignal({ x: 0, y: 0 });
    const [DNS, setDNS] = createSignal({ x: 1, y: 1 });
    const [GAS, setGAS] = createSignal(1);
    const [currentLocationOfLocalPlayer, setCurrentLocationOfLocalPlayer] = createSignal(1);
    const [viewportDimensions, setViewportDimensions] = createSignal({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [buffer, setBuffer] = createSignal('');
    const bufferSubscribers = createArrayStore<BufferSubscriber<string>>();
    const locationStore = createArrayStore(MOCK_LOCATIONS);

    const loadPathMap = (paths: typeof MOCK_PATHS): Map<number, number[]> => {
        const pathMap = new Map<number, number[]>();
        for (const path of paths) {
            if (!pathMap.has(path.from)) {
                pathMap.set(path.from, []);
            }
            pathMap.get(path.from)!.push(path.to);
            // Also add reverse direction
            if (!pathMap.has(path.to)) {
                pathMap.set(path.to, []);
            }
            pathMap.get(path.to)!.push(path.from);
        }
        return pathMap;
    };


    const pathMap = new Map<number, number[]>(loadPathMap(MOCK_PATHS));
    const log = props.backend.logger.copyFor('navigation trial');
    const elementRefs = new Map<string, EntityRef>();
    const [elementsReady, setElementsReady] = createSignal(false);

    setTimeout(() => props.onSlideCompleted(), 50); // CHANGE LATER

    // Create reactive scaled positions
    const getScaledPositions = createMemo(() => {
        const currentDNS = DNS();
        return MOCK_LOCATIONS.map(location => ({
            ...location,
            scaledPosition: {
                x: location.transform.xOffset * currentDNS.x,
                y: location.transform.yOffset * currentDNS.y
            }
        }));
    });


    // Utility to get the center position of an element by its reference key
    const getTargetCenterPosition = (locationId: string): Position | null => {
        const location = MOCK_LOCATIONS.find(loc => loc.id.toString() === locationId);
        if (!location) {
            console.log(`No location found for ID: ${locationId}`);
            return null;
        }

        // Use the scaled position directly
        const scaledPositions = getScaledPositions();
        const scaledLocation = scaledPositions.find(loc => loc.id.toString() === locationId);

        if (!scaledLocation) {
            console.log(`No scaled position for ID: ${locationId}`);
            return null;
        }

        return {
            x: scaledLocation.scaledPosition.x / window.innerWidth,
            y: scaledLocation.scaledPosition.y / window.innerHeight
        };
    };

    const getLocationPosition = (locationId: number) => {
        const scaledLocations = getScaledPositions();
        const location = scaledLocations.find(l => l.id === locationId);
        if (!location) return null;

        return location.scaledPosition;
    };

    const moveToLocation = (fromLocationId: number, toLocationId: number) => {
        const scaledLocations = getScaledPositions();
        const toLocation = scaledLocations.find(l => l.id === toLocationId);
        if (!toLocation) return;

        const viewport = viewportDimensions();

        const newOffset = {
            x: viewport.width / 2 - toLocation.scaledPosition.x,
            y: viewport.height / 2 - toLocation.scaledPosition.y
        };

        worldOffset.set(newOffset);
    };

    const trackElementRef = (id: number, element: HTMLElement | null) => {
        if (element) {
            elementRefs.set(id.toString(), {
                type: "location",
                element: element
            });
            if (elementRefs.size === MOCK_LOCATIONS.length) {
                setElementsReady(true);
            }
        }
    };

    createEffect(() => {
        console.log('Elements ready state:', elementsReady());
    });

    const renderablePaths = createMemo(() => {
        console.log("Recalculating paths");

        return pathStore.get.map(path => {
            const fromPosition = getTargetCenterPosition(path.from.toString());
            const toPosition = getTargetCenterPosition(path.to.toString());

            if (!fromPosition || !toPosition) {
                console.log(`Missing position for path ${path.from} -> ${path.to}`);
                return null;
            }

            console.log(`Calculated positions for path ${path.from} -> ${path.to}:`,
                { from: fromPosition, to: toPosition });

            const dx = (toPosition.x - fromPosition.x) * window.innerWidth;
            const dy = (toPosition.y - fromPosition.y) * window.innerHeight;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            return {
                fromPos: fromPosition,
                toPos: toPosition,
                length,
                angle
            };
        }).filter(Boolean);
    });

    const calculateScalars = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        setViewportDimensions({ width: newWidth, height: newHeight });
        setDNS({
            x: newWidth / EXPECTED_WIDTH,
            y: newHeight / EXPECTED_HEIGHT,
        });
        setGAS(Math.sqrt(Math.min(newWidth / EXPECTED_WIDTH, newHeight / EXPECTED_HEIGHT)));
    };

    const handleMove = (locationId: number) => {
        const paths = pathMap.get(currentLocationOfLocalPlayer());
        if (paths?.includes(locationId)) {
            log.subtrace(`Moving to location: ${locationId}`);
            props.context.events.emit(PLAYER_MOVE_EVENT, {
                playerID: props.backend.player.local.id,
                colonyLocationID: locationId
            });
        }
    };

    const handlePlayerMove = (data: { playerID: number; colonyLocationID: number }) => {
        if (data.playerID !== props.backend.player.local.id) return;

        const currentLoc = currentLocationOfLocalPlayer();
        const paths = pathMap.get(currentLoc);
        if (!paths?.includes(data.colonyLocationID)) return;

        moveToLocation(currentLoc, data.colonyLocationID);
        setCurrentLocationOfLocalPlayer(data.colonyLocationID);
    };

    const handleBufferUpdate = (value: string | ((prev: string) => string)) => {
        if (typeof value === "function") {
            setBuffer(prev => value(prev));
        } else {
            setBuffer(value);
        }
    };

    const debugPosition = (id: string, position: Position | null) => {
        console.log(`Position for ID ${id}:`, position);
        if (!position) {
            const ref = elementRefs.get(id);
            console.log(`Element ref for ID ${id}:`, ref);
            if (ref) {
                const rect = ref.element.getBoundingClientRect();
                console.log(`Element rect for ID ${id}:`, rect);
            }
        }
        return position;
    };

    onMount(() => {
        calculateScalars();
        window.addEventListener('resize', calculateScalars);

        const moveHandlerId = props.context.events.subscribe(PLAYER_MOVE_EVENT, handlePlayerMove);

        // Initialize world position to center HOME using scaled position
        const homePos = getLocationPosition(1);
        if (homePos) {
            const viewport = viewportDimensions();
            const initialOffset = {
                x: viewport.width / 2 - homePos.x,
                y: viewport.height / 2 - homePos.y
            };
            worldOffset.set(initialOffset);
        }

        createEffect(() => {
            if (elementRefs.size === MOCK_LOCATIONS.length) {
                setElementsReady(true);
            }
        });

        onCleanup(() => {
            window.removeEventListener('resize', calculateScalars);
            props.context.events.unsubscribe(moveHandlerId);
        });
    });

    bufferSubscribers.add((inputBuffer: string) => {
        const targetLocation = locationStore.findFirst(loc =>
            loc.name.toLowerCase() === inputBuffer.toLowerCase()
        );

        if (targetLocation) {
            handleMove(targetLocation.id);
            return { consumed: true };
        }
        return { consumed: false };
    });

    const computedCameraStyle = createMemo(() => {
        const offset = worldOffset.get();
        return css`
            ${cameraContainer}
            transform: translate(${offset.x}px, ${offset.y}px);
        `;
    });

    return (
        <div class={pathGraphContainerStyle}>
            <StarryBackground />
            {props.text.Title('TUTORIAL.TRIAL.TITLE')({ styleOverwrite: trialTitleStyleOverwrite })}
            {props.text.SubTitle('TUTORIAL.NAVIGATION_TRIAL.DESCRIPTION')({ styleOverwrite: subtitleStyleOverwrite })}

            <div class={computedCameraStyle()}>
                {/* Lines */}
                <For each={renderablePaths()}>
                    {(path) => {
                        if (!path) return null;

                        const lineStyle = (path: { length: number; angle: number; fromPos: Position }) => css`
                            position: absolute;
                            width: ${path.length}px;
                            height: 12px;
                            left: ${path.fromPos.x * window.innerWidth}px;
                            top: ${path.fromPos.y * window.innerHeight}px;
                            transform-origin: 0 50%;
                            transform: rotate(${path.angle}deg);
                            z-index: 1;
                            pointer-events: none;
                            background: linear-gradient(
                                to top,
                                transparent 0%,
                                rgba(255, 255, 255, 0.8) 50%,
                                transparent 100%
                            );
                            /* glow effect */
                            box-shadow: 
                                0 0 10px rgba(255, 255, 255, 0.3),
                                0 0 20px rgba(255, 255, 255, 0.2);
                            /* Smooth edges */
                            border-radius: 6px;
                        `;

                        return (
                            <>
                                {/* Main line */}
                                <div class={lineStyle(path)} />
                                {/* Glow overlay */}
                                <div
                                    class={css`
                                        ${lineStyle(path)}
                                        opacity: 0.3;
                                        filter: blur(4px);
                                        height: 16px;
                                        background: linear-gradient(
                                            to top,
                                            transparent 0%,
                                            rgba(255, 255, 255, 0.6) 50%,
                                            transparent 100%
                                        );
                                    `}
                                />
                            </>
                        );
                    }}
                </For>

                {/* Locations */}
                <For each={getScaledPositions()}>
                    {(location) => {
                        console.log(`Rendering location ${location.id} at scaled position:`, location.scaledPosition);

                        const buttonStyle = css`
                            position: absolute;
                            left: ${location.scaledPosition.x}px;
                            top: ${location.scaledPosition.y - 50}px;
                            transform: translate(-50%, -50%);
                            z-index: ${location.transform.zIndex + 1};
                        `;


                        const locationStyle = css`
                            position: absolute;
                            width: 64px;
                            height: 64px;
                            transform: translate(-50%, -50%);
                            left: ${location.scaledPosition.x}px;
                            top: ${location.scaledPosition.y}px;
                            z-index: ${location.transform.zIndex};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                            border-radius: 50%;
                            background-color: black;
                        `;

                        return (
                            <div class={locationContainerStyle}>

                                <BufferBasedButton
                                    styleOverwrite={buttonStyle}
                                    onActivation={() => handleMove(location.id)}
                                    name={location.name}
                                    buffer={buffer}
                                    register={bufferSubscribers.add}
                                    charBaseStyleOverwrite={namePlateTextStyle}
                                />
                                <div
                                    class={locationStyle}
                                    ref={(el) => trackElementRef(location.id, el)}
                                >
                                    <NTAwait func={() => props.backend.assets.getMetadata(1009)}>
                                        {(asset) => (
                                            <GraphicalAsset
                                                metadata={asset}
                                                backend={props.backend}
                                                styleOverwrite={css`
                                                    width: 100%;
                                                    height: 100%;
                                                    object-fit: cover;
                                                `}
                                            />
                                        )}
                                    </NTAwait>
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>

            <div class={localPlayerStyle} />

            <ActionInput
                subscribers={bufferSubscribers}
                text={props.text}
                backend={props.backend}
                actionContext={createMemo(() => ActionContext.NAVIGATION)}
                setInputBuffer={handleBufferUpdate}
                inputBuffer={buffer}
            />
        </div>
    );
};

export const trialTitleStyleOverwrite = css`
    position: absolute;
    font-size: 4rem;
    letter-spacing: 0;
    z-index: 100;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
`;

const subtitleStyleOverwrite = css`
    position: absolute;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    z-index: 100;
`;

const locationContainerStyle = css`
    position: absolute;
    left: 0;
    top: 0;
`;

const namePlateTextStyle = css`
    text-shadow: 5px 5px 10px black;
    color: white;
`;

const localPlayerStyle = css`
    position: absolute;
    z-index: 200;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    background-color: #ef4444;
    border-radius: 50%;
`;

const svgContainerStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    overflow: visible !important;
`;

const cameraContainer = css`
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    transition: all 0.5s ease-in-out;
`;

const pathGraphContainerStyle = css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: visible;
`;

export default NavigationTrial;