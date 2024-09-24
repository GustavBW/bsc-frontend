import { JSX } from "solid-js/jsx-runtime";
import StarryBackground from "../../src/components/StarryBackground";
import { css } from "@emotion/css";
import ActionInput from "../../src/components/MainActionInput";
import { ActionContext, BufferSubscriber, TypeIconTuple } from "../../src/ts/actionContext";
import { createMemo, createSignal } from "solid-js";
import BufferBasedButton from "../../src/components/BufferBasedButton";
import { createArrayStore } from "../../src/ts/wrappedStore";
import ManagedAsset from "../../src/components/ManagedAsset";
import { BackendIntegration } from "../../src/integrations/main_backend/mainBackend";
import VideoFrame from "./VideoFrame";
import ImageBufferButton from "../../src/components/ImageBufferButton";
import SectionTitle from "../../src/components/SectionTitle";
import SectionSubTitle from "../../src/components/SectionSubTitle";

interface NavigationDemoProps {
    onSlideCompleted: () => void;
    backend: BackendIntegration;
}
const timeBetweenKeyStrokesMS = 500;
const baseDelayBeforeDemoStart = 1000;
export default function NavigationDemo(props: NavigationDemoProps): JSX.Element {
    const [inputBuffer, setInputBuffer] = createSignal<string>('');
    const [actionContext, setActionContext] = createSignal<TypeIconTuple>(ActionContext.NAVIGATION);
    const [triggerEnter, setTriggerEnter] = createSignal<() => void>(() => {});
    const [movePlayerToLocation, setMovePlayerToLocation] = createSignal<boolean>(false);
    const bufferSubscribers = createArrayStore<BufferSubscriber<string>>();

    const nameOfLocation = "Outer Walls";
    for (let i = 0; i < nameOfLocation.length; i++) {
        setTimeout(() => {
            setInputBuffer(inputBuffer() + nameOfLocation[i]);
        }, baseDelayBeforeDemoStart + i * timeBetweenKeyStrokesMS);
    }
    setTimeout(() => {
        triggerEnter()();
    }, baseDelayBeforeDemoStart * 2 + nameOfLocation.length * timeBetweenKeyStrokesMS);

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
            <SectionSubTitle>
                Write where you want to go, and press Enter
            </SectionSubTitle>
            <VideoFrame styleOverwrite={videoDemoFrameStyle} backend={props.backend}> 
                <ActionInput subscribers={bufferSubscribers.get} 
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
                        name={nameOfLocation} 
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