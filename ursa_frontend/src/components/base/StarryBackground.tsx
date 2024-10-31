import { css } from '@emotion/css';
import { JSX } from 'solid-js/jsx-runtime';
import { IStyleOverwritable } from '../../ts/types';

interface StarryBackgroundProps extends IStyleOverwritable {
    children?: JSX.Element;
}

export default function StarryBackground(props: StarryBackgroundProps): JSX.Element {
    return (
        <div
            class={css`
                ${starBackground} ${props.styleOverwrite}
            `}
            id="starry-background"
        >
            {props.children}
        </div>
    );
}
const starBackground = css`
    z-index: -10000000;
    position: fixed;
    top: -1px;
    left: -1px;
    width: 101%;
    height: 101%;
    background-image: url('https://cdn.mos.cms.futurecdn.net/BfemybeKVXCf9pgX9WCxsc-1200-80.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 1.5s ease-out;
    filter: blur(2px);
    overflow: clip;
`;