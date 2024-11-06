import { css } from '@emotion/css';

/**
 * Container style for all particle effects
 */
export const particleContainerStyle = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 10;
    overflow: visible;
`;

/**
 * Function to generate rotating animation style
 */
export const stunParticleBaseStyle = css`
    position: absolute;
`;

export const stunParticleVerticalStyle = css`
    animation: riseY 4s linear forwards;
    @keyframes riseY {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        5% {
            opacity: 1;
            transform: translateY(-20%) scale(1.2);
        }
        90% {
            opacity: 1;
            transform: translateY(-450%) scale(0.8);
        }
        100% {
            transform: translateY(-500%) scale(0.2);
            opacity: 0;
        }
    }
`;

export const stunParticleHorizontalStyle = css`
    animation: spreadX 4s cubic-bezier(0, 0, 0.05, 1) forwards;

    @keyframes spreadX {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(var(--spread-x));
        }
    }
`;

export const stunParticleContentStyle = css`
    width: var(--particle-size);
    height: var(--particle-size);
    border-radius: 50%;
    mix-blend-mode: screen;
    z-index: 1000;
    pointer-events: none;
    filter: blur(var(--blur-amount));
    background-image: radial-gradient(var(--glow-color) 10%, var(--mid-color) 30%, var(--outer-color) 50%, rgba(255, 30, 0, 0) 70%);
    box-shadow:
        0 0 1em 0.2em rgba(255, 200, 0, 0.5),
        0 0 2em 0.5em rgba(255, 100, 0, 0.3);
`;

/**
 * Animation duration constants
 */
export const PARTICLE_ANIMATION_DURATIONS = {
    STUN: 6000, // 6 seconds
    FADE_IN: 150, // 0.15 seconds
    FADE_OUT: 300, // 0.3 seconds
};

/**
 * Utility function to generate blur style
 */
export const getBlurStyle = (amount: number) => css`
    filter: blur(${amount}em);
`;

/**
 * Utility function for dynamic particle size
 */
export const getParticleSizeStyle = (baseSize: number, variance: number = 0.5) => {
    const size = baseSize + Math.random() * variance;
    return css`
        width: ${size}em;
        height: ${size}em;
    `;
};

/**
 * Z-index constants for proper layering
 */
export const PARTICLE_Z_INDICES = {
    CONTAINER: 10,
    PARTICLE_BASE: 100,
    PARTICLE_EFFECT: 101,
};
