import { Accessor, Component, For } from "solid-js";
import { IBufferBased, IStyleOverwritable } from "../ts/types";
import { css } from "@emotion/css";
import SectionTitle from "./SectionTitle";

export interface BufferHighlightedNameProps extends IStyleOverwritable, IBufferBased {
    name: string;
    nameCompleteOverwrite?: string;
    charHighlightOverwrite?: string;
    charBaseStyleOverwrite?: string;
}

const BufferHighlightedName: Component<BufferHighlightedNameProps> = (props) => {

    const computedCharBaseStyle = css`${singleCharStyle} ${props.charBaseStyleOverwrite}`;
    const computedCharHighlightStyle = css`${computedCharBaseStyle} ${singleCharHighlightStyle} ${props.charHighlightOverwrite}`;
    const computedNameCompleteStyle = css`${computedCharHighlightStyle} ${nameCompleteStyle} ${props.nameCompleteOverwrite}`;

    const getCharStyle = (index: Accessor<number>, charInName: string) => {
        if (props.buffer() === props.name) {
            return computedNameCompleteStyle;
        }
        if (props.buffer().charAt(index()) === charInName) {
            return computedCharHighlightStyle;
        }
        return computedCharBaseStyle;
    }

    return (
        <div class={css`${locationNameContainerStyle} ${props.styleOverwrite}`} id={"buffer-highlighted-name-"+props.name}>
            <For each={props.name.split('')}>{(char, index) => (
                <SectionTitle styleOverwrite={getCharStyle(index, char)}>{char}</SectionTitle>
            )}</For>
        </div>
    );
}
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
`

const singleCharHighlightStyle = css`
color: white;
text-shadow: 0 0 .4rem hsla(0, 0%, 100%, 0.5);
text-decoration: underline;
`

const nameCompleteStyle = css`
color: green;
text-shadow: 0 0 .4rem black;

`

const locationNameContainerStyle = css`
display:flex;
flex-direction: row;
`