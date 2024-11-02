import { Styles } from '@/sharedCSS';
import { css } from '@emotion/css';

// All styles need to be exported
export const wallStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 4vw;
    height: 100vh;
    background: linear-gradient(to right, #4a4a4a, #bebebe);
    overflow: hidden;
`;

export const statusStyle = css`
    position: absolute;
    top: 1vh;
    left: 1vh;
    color: #004f00;
    text-shadow: 0 0 0.5rem rgba(0, 255, 0, 1);
    font-size: 5rem;
`;

export const timeLeftStyle = css`
    ${Styles.SUB_TITLE}
    position: absolute;
    left: 1vh;
    top: 10vh;
`

export const asteroidStyle = css`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 10rem;
    height: 10rem;
`;

export const asteroidImageContainerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

export const asteroidButtonStyle = css`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
    color: white;
    text-align: center;
`;

export const rotatingStyle = (speedSeconds: number) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    animation: rotate ${speedSeconds}s linear infinite;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

export const lazerBeamStyle = css`
    position: absolute;
    height: 0.5rem;
    transform-origin: left center;
    background: linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 255, 255, 1) 50%, rgba(255, 0, 0, 0.8));
    filter: blur(0.15rem);
    box-shadow:
        0 0 0.5rem rgba(255, 0, 0, 0.5),
        0 0 1rem rgba(255, 0, 0, 0.3);
    animation:
        lazerFlicker 0.2s infinite alternate,
        lazerFade 1s forwards;

    @keyframes lazerFlicker {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    @keyframes lazerFade {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;

export const impactCircleStyle = css`
    position: absolute;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 0, 0, 1) 50%, rgba(255, 0, 0, 0) 100%);
    filter: blur(0.15rem);
    box-shadow:
        0 0 1rem rgba(255, 0, 0, 0.5),
        0 0 2rem rgba(255, 0, 0, 0.3);
    animation:
        lazerFlicker 0.2s infinite alternate,
        lazerFade 1s forwards;
`;

export const buttonStyleOverwrite = css`
    position: absolute;
    top: 1vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 100;
`;

export const playerContainerStyle = (x: number, y: number) => css`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    top: ${y * 100}%;
    left: ${x * 100}%;

    /* Remove fixed width/height to allow content-based sizing */
    width: 10vh;
    height: 10vh;
    
    transform: translate(-50%, -50%);
`;

export const playerIdStyle = css`
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
`;

export const stunnedStyle = css`
    position: absolute;
    inset: 0; // Shorthand for top/right/bottom/left: 0
    width: 100%;
    height: 100%;
    background: yellow; // Very obvious for debugging
    opacity: 0.3;
    pointer-events: none;
`;

export const disabledStyle = css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: red; // Very obvious for debugging
    opacity: 0.3;
    pointer-events: none;
`;

export const stunEffectStyle = css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    filter: blur(0.04em);
    pointer-events: none;
    z-index: 100; // Increased z-index
    overflow: visible !important; // Force visible overflow
    border: 1px solid blue; // Debug border
`;

export const stunParticleStyle = css`
    position: absolute;
    bottom: 0;
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    mix-blend-mode: screen;
    opacity: 0;
    z-index: 101;
    pointer-events: none;
    background-image: radial-gradient(rgba(255, 255, 0, 0.8) 20%, rgba(255, 255, 150, 0.4) 40%, rgba(255, 255, 0, 0) 70%);

    @keyframes stunRise {
        0% {
            opacity: 0;
            transform: translateY(0) scale(1);
        }
        5% {
            opacity: 1;
        }
        70% {
            opacity: 0.8;
            transform: translateY(-1000%) scale(0.8);
        }
        90% {
            // Gradual fade out near the top
            opacity: 0.2;
            transform: translateY(-1100%) scale(0.4);
        }
        100% {
            // Complete fade at max height
            opacity: 0;
            transform: translateY(-1200%) scale(0);
        }
    }
`;