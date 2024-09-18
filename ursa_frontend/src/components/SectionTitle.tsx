import { css } from "@emotion/css";
import { JSX } from "solid-js/jsx-runtime";

interface SectionTitleProps {
    children: JSX.Element;
    styleOverwrite?: string;
}

export default function SectionTitle(props: SectionTitleProps): JSX.Element {
    return (
        <div class={css`${gameTitleStyle} ${props.styleOverwrite}`}>{props.children}</div>
    )
}

const gameTitleStyle = css`
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    letter-spacing: 1rem;
    text-transform: uppercase;
    color: white;
    margin: 2rem;
    font-size: 3rem;
    text-shadow: .75rem .3rem .3rem rgba(255, 255, 255, .3);
`