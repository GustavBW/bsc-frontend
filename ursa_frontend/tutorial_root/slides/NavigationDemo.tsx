import { JSX } from "solid-js/jsx-runtime";
import StarryBackground from "../../src/components/StarryBackground";
import { css } from "@emotion/css";
import ActionInput from "../../src/components/MainActionInput";
import { ActionContext, BufferSubscriber, TypeIconTuple } from "../../src/ts/actionContext";
import { createMemo, createSignal } from "solid-js";
import { createArrayStore } from "../../src/ts/wrappedStore";
import ManagedAsset from "../../src/components/ManagedAsset";
import VideoFrame from "./VideoFrame";
import ImageBufferButton from "../../src/components/ImageBufferButton";
import SectionSubTitle from "../../src/components/SectionSubTitle";
import { IBackendBased, IInternationalized } from "../../src/ts/types";

interface NavigationDemoProps extends IInternationalized, IBackendBased {
    onSlideCompleted: () => void;
}
const timeBetweenKeyStrokesMS = 500;
const baseDelayBeforeDemoStart = 1000;
export default function NavigationDemo(props: NavigationDemoProps): JSX.Element {
    const [inputBuffer, setInputBuffer] = createSignal<string>('');
    const [actionContext, setActionContext] = createSignal<TypeIconTuple>(ActionContext.NAVIGATION);
    const [triggerEnter, setTriggerEnter] = createSignal<() => void>(() => {});
    const [movePlayerToLocation, setMovePlayerToLocation] = createSignal<boolean>(false);
    const bufferSubscribers = createArrayStore<BufferSubscriber<string>>();

    const nameOfLocation = props.text.get('LOCATION.OUTER_WALLS.NAME');
    for (let i = 0; i < nameOfLocation.get().length; i++) {
        setTimeout(() => {
            setInputBuffer(inputBuffer() + nameOfLocation.get()[i]);
        }, baseDelayBeforeDemoStart + i * timeBetweenKeyStrokesMS);
    }
    setTimeout(() => {
        triggerEnter()();
    }, baseDelayBeforeDemoStart * 2 + nameOfLocation.get().length * timeBetweenKeyStrokesMS);

    const buttonPressed = () => {
        setMovePlayerToLocation(true);
        setTimeout(() => {
            props.onSlideCompleted()
        }, 2000)
    }

    const computedPlayerStyle = createMemo(
        () => css`${playerCharStyleOverwrite} ${movePlayerToLocation() ? playerAtLocation : ''}`
    )

    return (
        <div class="navigation-demo">
            <StarryBackground />
            {props.text.SubTitle('TUTORIAL.NAVIGATION_DEMO.DESCRIPTION')({})}
            <VideoFrame styleOverwrite={videoDemoFrameStyle} backend={props.backend}> 
                <ActionInput subscribers={bufferSubscribers.get} 
                    text={props.text}
                    backend={props.backend}
                    actionContext={actionContext} 
                    setInputBuffer={setInputBuffer}
                    inputBuffer={inputBuffer}
                    demoMode={true}
                    triggerEnter={setTriggerEnter}
                />
                <div class={movementPathStyle}>
                </div>
                    <ImageBufferButton 
                        styleOverwrite={locationPinStyleOverwrite}
                        register={bufferSubscribers.add} 
                        name={nameOfLocation.get()} 
                        buffer={inputBuffer}
                        onActivation={buttonPressed} 
                        asset={3} 
                        backend={props.backend}
                    />
                    <ManagedAsset styleOverwrite={computedPlayerStyle()} asset={8} backend={props.backend} />
            </VideoFrame>
            
        </div>
    )
}

const movementPathStyle = css`
border-bottom: 1px dashed white;
height: 66%;
width: 50%;
position: absolute;
left: 50%;
transform: translateX(-50%);
`

const shared = css`
position: absolute;
--edge-offset: 5vw;
bottom: 20vh;
`

const playerCharStyleOverwrite = css`
${shared}
left: var(--edge-offset);
--dude-size: 8vw;
width: var(--dude-size);
height: var(--dude-size);
transition: left 2s;
`

const playerAtLocation = css`
left: 70%;
`
const locationPinStyleOverwrite = css`
${shared}
right: var(--edge-offset);
`

const videoDemoFrameStyle = css`
margin-top: 2rem;
`