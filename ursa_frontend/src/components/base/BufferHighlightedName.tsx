import { Accessor, Component, createEffect, createMemo, createSignal, For } from 'solid-js';
import { css } from '@emotion/css';
import { IStyleOverwritable, IBufferBased } from '../../ts/types';
import SectionTitle from './SectionTitle';

export interface BufferHighlightedNameProps extends IStyleOverwritable, IBufferBased {
    name: Accessor<string> | string;
    nameCompleteOverwrite?: string;
    charHighlightOverwrite?: string;
    charBaseStyleOverwrite?: string;
}

const BufferHighlightedName: Component<BufferHighlightedNameProps> = (props) => {
    const [hasBeenMissed, setHasBeenMissed] = createSignal(false);

    const computedCharBaseStyle = createMemo(
        () => css`
            ${singleCharStyle} ${props.charBaseStyleOverwrite}
        `,
    );
    const computedCharHighlightStyle = createMemo(
        () => css`
            ${computedCharBaseStyle()} ${singleCharHighlightStyle} ${props.charHighlightOverwrite}
        `,
    );
    const computedNameCompleteStyle = createMemo(
        () => css`
            ${computedCharHighlightStyle()} ${nameCompleteStyle} ${props.nameCompleteOverwrite}
        `,
    );

    createEffect(() => {
        const currentName = typeof props.name === 'function' ? props.name() : props.name;
        if (currentName.includes(props.buffer())) {
            setHasBeenMissed(false);
        } else {
            setHasBeenMissed(true);
        }
    });

    const getCharStyle = (index: Accessor<number>, charInName: string) => {
        if (hasBeenMissed()) {
            return computedCharBaseStyle();
        }
        if (props.buffer() === props.name) {
            return computedNameCompleteStyle();
        }
        if (props.buffer().charAt(index()) === charInName) {
            return computedCharHighlightStyle();
        }
        return computedCharBaseStyle();
    };

    const splitString = (name: Accessor<string> | string) => {
        if (typeof name === 'string') {
            return name.split('');
        } else {
            return name().split('');
        }
    };

    return (
        <div
            class={css`
                ${locationNameContainerStyle} ${props.styleOverwrite}
            `}
            id={'buffer-highlighted-name-' + props.name}
        >
            <For each={splitString(props.name)}>
                {(char, index) => <SectionTitle styleOverwrite={getCharStyle(index, char)}>{char}</SectionTitle>}
            </For>
        </div>
    );
};
export default BufferHighlightedName;

const singleCharStyle = css`
    text-transform: none;
    margin: 0;
    font-size: 2rem;
    letter-spacing: 0;
    min-width: 0.5rem;
    color: hsla(0, 0%, 100%, 0.5);
    text-shadow: none;
    text-decoration: none;
`;

const singleCharHighlightStyle = css`
    color: white;
    text-shadow: 0 0 0.4rem hsla(0, 0%, 100%, 0.5);
    text-decoration: underline;
`;

const nameCompleteStyle = css`
    color: green;
    text-shadow: 0 0 0.4rem black;
`;

const locationNameContainerStyle = css`
    display: flex;
    flex-direction: row;
    border-radius: 10px;
`;
