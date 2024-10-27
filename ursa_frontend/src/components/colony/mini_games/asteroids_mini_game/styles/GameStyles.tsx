import { css } from "@emotion/css";

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
  top: 10px;
  left: 10px;
  color: white;
  font-size: 18px;
`;

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
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const lazerBeamStyle = css`
  position: absolute;
  height: 0.5rem;
  transform-origin: left center;
  background: linear-gradient(
    to right,
    rgba(255, 0, 0, 0.8),
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 0, 0, 0.8)
  );
  filter: blur(0.15rem);
  box-shadow: 
    0 0 0.5rem rgba(255, 0, 0, 0.5),
    0 0 1rem rgba(255, 0, 0, 0.3);
  animation: lazerFlicker 0.2s infinite alternate, lazerFade 1s forwards;

  @keyframes lazerFlicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes lazerFade {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export const impactCircleStyle = css`
  position: absolute;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 0, 0, 1) 50%,
    rgba(255, 0, 0, 0) 100%
  );
  filter: blur(0.15rem);
  box-shadow: 
    0 0 1rem rgba(255, 0, 0, 0.5),
    0 0 2rem rgba(255, 0, 0, 0.3);
  animation: lazerFlicker 0.2s infinite alternate, lazerFade 1s forwards;
`;

export const buttonContainerStyle = css`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  color: white;
  text-align: center;
`;

export const stunnedStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.9; }
    100% { transform: scale(0.95); opacity: 0.7; }
  }
`;

export const disabledStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    background: radial-gradient(ellipse at center, rgba(255,69,0,0.5) 0%, rgba(255,69,0,0) 70%);
    border-radius: 50%;
    animation: flicker 0.5s infinite alternate;
  }

  @keyframes flicker {
    0% { opacity: 0.5; transform: scale(0.98); }
    100% { opacity: 0.8; transform: scale(1.02); }
  }
`;

export const playerStyle = css`
   position: absolute;
   display: flex;
   flex-direction: column;
   justify-content: flex-end;
   align-items: center;
   /* Remove fixed width/height to allow content-based sizing */
   width: auto;
   min-width: fit-content;
   transform-origin: bottom center;
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

export const playerCharacterStyle = css`
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   width: auto;
   height: auto;
   
   img {
     width: auto;
     height: auto;
     max-height: 10rem; /* Adjust this value based on your needs */
   }
`;