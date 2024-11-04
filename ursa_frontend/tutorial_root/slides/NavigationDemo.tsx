import { JSX } from 'solid-js/jsx-runtime';
import { createMemo, createSignal, onMount } from 'solid-js';
import VideoFrame from './VideoFrame';
import GraphicalAsset from '@/components/base/GraphicalAsset';
import ImageBufferButton from '@/components/base/ImageBufferButton';
import StarryBackground from '@/components/base/StarryBackground';
import ActionInput from '@/components/colony/MainActionInput';
import NTAwait from '@/components/util/NoThrowAwait';
import { TypeIconTuple, ActionContext, BufferSubscriber } from '@/ts/actionContext';
import { createArrayStore } from '@/ts/arrayStore';
import { IInternationalized, IBackendBased } from '@/ts/types';
import { css } from '@emotion/css';
import { typeText } from '@tutorial/utils/tutorialUtils';
import { tutorialStyles } from '@tutorial/styles/tutorialStyles';

interface NavigationDemoProps extends IInternationalized, IBackendBased {
    onSlideCompleted: () => void;
}

// Keep only demo-specific styles that aren't shared across components
const demoStyles = {
    videoFrame: css`
        margin-top: 2rem;
    `,

    characterContainer: css`
        position: absolute;
        --edge-offset: 5vw;
        bottom: 20vh;
    `,

    location: {
        pin: css`
            position: absolute;
            --edge-offset: 5vw;
            bottom: 20vh;
            right: var(--edge-offset);
        `,

        player: (isAtLocation: boolean) => css`
            ${tutorialStyles.elements.characterBase}
            left: var(--edge-offset);
            transition: left 2s;
            ${isAtLocation ? 'left: 70%;' : ''}
        `
    }
};

export default function NavigationDemo(props: NavigationDemoProps): JSX.Element {
    const [inputBuffer, setInputBuffer] = createSignal<string>('');
    const [actionContext] = createSignal<TypeIconTuple>(ActionContext.NAVIGATION);
    const [triggerEnter, setTriggerEnter] = createSignal<number>(0);
    const [movePlayerToLocation, setMovePlayerToLocation] = createSignal<boolean>(false);
    const bufferSubscribers = createArrayStore<BufferSubscriber<string>>();

    const nameOfLocation = props.text.get('LOCATION.OUTER_WALLS.NAME').get();

    const handleButtonPress = () => {
        setMovePlayerToLocation(true);
        setTimeout(() => props.onSlideCompleted(), 2000);
    };

    onMount(() => {
        typeText({
            text: nameOfLocation,
            delay: 500,
            onType: (text) => setInputBuffer(text),
            onComplete: () => {
                setTimeout(() => {
                    setTriggerEnter(prev => prev + 1);
                }, 1000);
            }
        });
    });

    const computedPlayerStyle = createMemo(() =>
        demoStyles.location.player(movePlayerToLocation())
    );

    return (
        <div class={tutorialStyles.layout.container}>
            <StarryBackground />
            {props.text.SubTitle('TUTORIAL.NAVIGATION_DEMO.DESCRIPTION')({
                styleOverwrite: tutorialStyles.typography.subtitle
            })}

            <VideoFrame
                styleOverwrite={demoStyles.videoFrame}
                backend={props.backend}
            >
                <ActionInput
                    subscribers={bufferSubscribers}
                    text={props.text}
                    backend={props.backend}
                    actionContext={actionContext}
                    setInputBuffer={setInputBuffer}
                    inputBuffer={inputBuffer}
                    manTriggerEnter={triggerEnter}
                    demoMode={true}
                />

                <div class={tutorialStyles.elements.movementPath} />

                <ImageBufferButton
                    styleOverwrite={demoStyles.location.pin}
                    register={bufferSubscribers.add}
                    name={nameOfLocation}
                    buffer={inputBuffer}
                    onActivation={handleButtonPress}
                    asset={1009}
                    backend={props.backend}
                />

                <NTAwait func={() => props.backend.assets.getMetadata(4001)}>
                    {(asset) => (
                        <GraphicalAsset
                            styleOverwrite={computedPlayerStyle()}
                            metadata={asset}
                            backend={props.backend}
                        />
                    )}
                </NTAwait>
            </VideoFrame>
        </div>
    );
}