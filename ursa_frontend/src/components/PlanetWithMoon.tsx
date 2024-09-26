import { Component, createMemo } from "solid-js";
import { css } from "@emotion/css";
import { IBackendBased, IStyleOverwritable } from "../ts/types";
import { AssetID } from "../integrations/main_backend/mainBackendDTOs";
import NTAwait from "./util/NoThrowAwait";
import Planet from "./Planet";

interface PlanetWithMoonProps extends IBackendBased, IStyleOverwritable {
  moonAssetOverwrite?: AssetID,
  planetAssetOverwrite?: AssetID,
  size?: number
}

const PlanetWithMoon: Component<PlanetWithMoonProps> = (props) => {
  const cssvars = css`
    --pvm-size: ${props.size ?? 10}vh;
  `;

  const containerStyle = css`
    ${cssvars}
    position: relative;
    width: var(--pvm-size);
    height: var(--pvm-size);
  `;

  const computedStyles = createMemo(() => css`${containerStyle} ${props.styleOverwrite}`)

  return (
    <div class={computedStyles()}>
      <NTAwait func={() => props.backend.getAssetMetadata(props.planetAssetOverwrite ?? 5)}>
        {(asset) => (
          <Planet useShadow={true} styleOverwrite={planetStyle(cssvars)} metadata={asset} backend={props.backend}>
            <NTAwait func={() => props.backend.getAssetMetadata(props.moonAssetOverwrite ?? 7)}>
              {(moonAsset) => (
                <Planet useShadow={false} styleOverwrite={moonOrbitStyle(cssvars)} metadata={moonAsset} backend={props.backend} />
              )}
            </NTAwait>
          </Planet>
        )}
      </NTAwait>
    </div>
  );
};

export default PlanetWithMoon;

const planetStyle = (cssvars: string) => css`
`;

const moonOrbitStyle = (cssvars: string) => css`
  top: 100%;
`;

const moonStyle = (cssvars: string) => css`
  width: 6%;
  height: 6%;
  position: absolute; 
  --base-moon-left: 50%;
  
  animation: orbit 6s infinite ease-in-out;

  --orbit-radius: 50%; 
  @keyframes orbit {
    0% {
      z-index: 1; 
      left: calc(var(--orbit-radius) * -1 + var(--base-moon-left));
    }
    49% { 
      z-index: 1; 
      left: calc(var(--orbit-radius) + var(--base-moon-left));
    }
    50% { 
      z-index: -1;
      left: calc(var(--orbit-radius) + var(--base-moon-left));
    }
    99% {
      z-index: -1;
      left: calc(var(--orbit-radius) * -1 + var(--base-moon-left));
    }
    100% {
      left: calc(var(--orbit-radius) * -1 + var(--base-moon-left));
      z-index: 1;
    }
  }
`;