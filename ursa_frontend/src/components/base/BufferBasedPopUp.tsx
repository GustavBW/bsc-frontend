import { Styles } from "@/sharedCSS";
import { IBufferBased, IInternationalized, IParenting, IRegistering, IStyleOverwritable } from "@/ts/types";
import { css } from "@emotion/css";
import { Component } from "solid-js";
import BufferBasedButton from "./BufferBasedButton";

interface Props extends IParenting, IStyleOverwritable, IBufferBased, IRegistering<string>, IInternationalized {
    title?: string;
    clearSelf?: () => void;
}

const BufferBasedPopUp: Component<Props> = (props) => {
    return (
        <div class={css`${Styles.OVERLAY.CENTERED_QUARTER} ${props.styleOverwrite}`}>
            {props.title && <div class={css`${Styles.SUB_TITLE} position: absolute; top: 1vh;`}>{props.title}</div>}
            {props.children}
            {props.clearSelf && <BufferBasedButton 
                onActivation={props.clearSelf}
                name={props.text.get("COLONY.UI_BUTTON.CLOSE").get}
                buffer={props.buffer}
                register={props.register}
                styleOverwrite={css`position: absolute; bottom: 1vh;`}
            />}
        </div>
    );
};
export default BufferBasedPopUp;