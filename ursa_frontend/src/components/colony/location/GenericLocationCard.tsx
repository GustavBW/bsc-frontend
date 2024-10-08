import { Component, createSignal, For, onCleanup, onMount } from "solid-js";
import { IBackendBased, IBufferBased, IInternationalized, IRegistering } from "../../../ts/types";
import { ColonyLocationInformation, LocationInfoResponseDTO, MinigameDifficultyResponseDTO, uint32 } from "../../../integrations/main_backend/mainBackendDTOs";
import { css } from "@emotion/css";
import BufferBasedButton from "../../BufferBasedButton";
import NTAwait from "../../util/NoThrowAwait";
import GraphicalAsset from "../../GraphicalAsset";
import { IEventMultiplexer } from "../../../integrations/multiplayer_backend/eventMultiplexer";
import MinigameDifficultyListEntry from "./MinigameDifficultyListEntry";
import { DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT, DIFFICULTY_SELECT_FOR_MINIGAME_EVENT, DifficultySelectForMinigameMessageDTO } from "../../../integrations/multiplayer_backend/EventSpecifications";

export interface GenericLocationCardProps extends IBufferBased, IBackendBased, IInternationalized, IRegistering<string>{
    colonyLocation: ColonyLocationInformation;
    info: LocationInfoResponseDTO;
    events: IEventMultiplexer;
    closeCard: () => void;
}

const getIdOfSplashArt = (level: number, choices: {
    level: uint32;
    splashArt: uint32;
    assetCollectionID: uint32;
}[]) => {
    for (let choice of choices) {
        if (choice.level === level) {
            return choice.splashArt;
        }
    }
    return choices[0].splashArt;

}

const GenericLocationCard: Component<GenericLocationCardProps> = (props) => {
    const [difficultySelected, setDifficultySelected] = createSignal<DifficultySelectForMinigameMessageDTO | null>(null);

    onMount(() => {
        const diffSelectSubID = props.events.subscribe(DIFFICULTY_SELECT_FOR_MINIGAME_EVENT, (data) => {
            if (data.minigameID === props.info.minigameID) {
                setDifficultySelected(data);
            }
        });
        onCleanup(() => props.events.unsubscribe(diffSelectSubID));
    })

    const onDifficultyConfirmed = () => {
        const diff = difficultySelected();
        if (diff !== null) {
            props.events.emit(DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT, diff);
            console.log("[delete me] difficulty confirmed for minigame: " + diff.minigameID + " difficulty: " + diff.difficultyID);
        }
    }

    const isDifficultyUnlocked = (diff: MinigameDifficultyResponseDTO) => {
        return props.colonyLocation.level >= diff.requiredLevel;
    }

    return (
        <div class={cardContainerStyle} id={"location-card-" + props.info.name}>
            {props.text.Title(props.info.name)({styleOverwrite: titleStyleOverwrite})}
            <div class={sideBySideStyle}>
                <div class={difficultyListStyle}>
                    <NTAwait func={() => props.backend.getMinigameInfo(props.info.minigameID)}>{(minigame) => 
                        <For each={minigame.difficulties}>{(difficulty) =>
                            <MinigameDifficultyListEntry 
                                difficulty={difficulty} 
                                minigameID={minigame.id} 
                                buffer={props.buffer} 
                                register={props.register} 
                                backend={props.backend} 
                                emit={props.events.emit}
                                text={props.text}
                                enabled={() => isDifficultyUnlocked(difficulty)}
                            />
                        }</For>
                    }</NTAwait>
                </div>
                <div class={rightSideContentStyle}>
                    <NTAwait func={() => props.backend.getAssetMetadata(getIdOfSplashArt(props.colonyLocation.level, props.info.appearances))}>{(asset) =>
                        <GraphicalAsset styleOverwrite={imageStyleOverride} backend={props.backend} metadata={asset} />
                    }</NTAwait>
                    {props.text.SubTitle(props.info.description)({styleOverwrite: descriptionStyleOverwrite})}
                </div>
            </div>
            <div class={leaveButtonContainerStyle}>
                <BufferBasedButton 
                    name={props.text.get("LOCATION.USER_ACTION.LEAVE").get()}
                    buffer={props.buffer}
                    register={props.register}
                    onActivation={props.closeCard}
                    styleOverwrite={leaveButtonOverrideStyle}
                />
                <BufferBasedButton 
                    name={props.text.get("MINIGAME.START").get()}
                    buffer={props.buffer}
                    register={props.register}
                    onActivation={onDifficultyConfirmed}
                    styleOverwrite={leaveButtonOverrideStyle}
                    enable={() => difficultySelected() !== null}
                />
            </div>
        </div>
    )
}
export default GenericLocationCard;

const imageStyleOverride = css`
--size: 20vw;
width: var(--size);
height: var(--size);
`

const titleStyleOverwrite = css`
font-size: 3.5rem;
width: 100%;
text-align: center;
top: 0;
margin-top: -5vh;
`
const descriptionStyleOverwrite = css`
font-size: 1.5rem;
`

const sideBySideStyle = css`
display: flex;
flex-direction: row;
height: 100%;
width: 100%;
`

const difficultyListStyle = css`
display: flex;
flex-direction: column;
height: 100%;
width: 30%;
justify-content: flex-start;
align-items: center;
column-gap: 1rem;
`

const rightSideContentStyle = css`
display: flex;
flex-direction: column;
height: 100%;
width: 70%;
column-gap: 1rem;
`

const leaveButtonContainerStyle = css`
display: flex;
flex-direction: row;
width: 100%;
justify-content: center;
align-items: center;
`

const leaveButtonOverrideStyle = css`
`

const cardContainerStyle = css`
height: 80%;
`