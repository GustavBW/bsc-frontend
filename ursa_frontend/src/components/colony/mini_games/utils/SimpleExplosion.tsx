import { TransformDTO } from "@/integrations/main_backend/mainBackendDTOs";
import { Styles } from "@/styles/sharedCSS";
import { normalizeVec2, Vec2, Vec2_ZERO } from "@/ts/geometry";
import { GlobalHashPool, GlobalRandom } from "@/ts/ursaMath";
import { css } from "@emotion/css";
import { For, JSX } from "solid-js";

export interface SimpleExplosionProps {
    /** Where to show the explosion */
    coords: Vec2;
    /** Duration of the explosion in milliseconds 
     * @default 500
    */
    durationMS?: number;
    /** Number of particles @default 10 */
    particleCount?: number;
    /** Base size of particle in percent of parent size as a range from 0 to 1 @default .1 */
    particleSize?: number;
    /** A reduction in scale by up to the given variance @default .5 */
    particleSizeVariance?: number;
    /** Overall size of explosion, calculated in amounts of view width (vw) */
    size?: number;
    /** As percent of parent size (0-1). How far the particles should spread from the center.
     * Where 1 (100%) is to the edge of the parent element.
     * @default .5
     */
    spread?: number;
    /** Up to how much to randomly reduce the spread for each child. Given here as a 0-1 value which corresponds to
     * reducing final spread by up to 100%.
     * @default 0.3
     */
    spreadVariance?: number;
    /** Direction from which to generally spread away from
     * @default { x: 0, y: 0 } 
     */
    incomingNormalized?: Vec2;
    /** How much the incoming vector should influence the direction of child particles
     * @default 1
     */
    incomingWeight?: number;
    preComputedParticles?: JSX.Element[];
    /** Function to generate the child elements. 
     * @param computedAnimationStyle The computed style for the child element, including the animation
     * @default ```tsx
     *  (animation, children) => <div class={animation}>{children}</div>
     * ```
     * */
    particleGeneratorFunc?: (index: number, computedAnimationStyle: string, children: JSX.Element) => JSX.Element;
    /** Additional content to include for each child particle */
    additionalChildContent?: () => JSX.Element;
    /** Show parent outline */
    showParentOutline?: boolean;
}
interface ParticleEndState {
    /** In pre-formatted % (0-100) */
    x: number,
    /** In pre-formatted % (0-100) */
    y: number,
    scale: number,
    randHash: string;
}

export const NULL_JSX: Readonly<JSX.Element> = <></>;
const defaults: Omit<Required<SimpleExplosionProps>, 'preComputedParticles'> & Partial<Pick<SimpleExplosionProps, 'preComputedParticles'>> = {
    coords: Vec2_ZERO,
    durationMS: 500,
    particleCount: 10,
    particleSize: .1,
    particleSizeVariance: .5,
    size: 20,
    spread: .5,
    spreadVariance: .3,
    incomingNormalized: Vec2_ZERO,
    incomingWeight: 1,
    showParentOutline: false,
    additionalChildContent: (() => NULL_JSX) as () => JSX.Element,
    particleGeneratorFunc: (i, a, c) => <div class={a}>{c}</div>,
}
/** Simple explosion-like effect */
export default function SimpleExplosion(
    // these props are destructured and thus not reactive. They are not meant to be reactive any way.
    rawProps: SimpleExplosionProps) 
{
    const props = { ...defaults, ...rawProps };
    const generateParticles = () => {
        //Takes 8ms for 50 particles on good hardware, i.e. not the bottleneck
        const particles: JSX.Element[] = [];
        for (let i = 0; i < props.particleCount; i++) {
            const normalizedRandomDirection = normalizeVec2({ 
                x: (GlobalRandom.next() - .5) + (props.incomingNormalized.x * props.incomingWeight), 
                y: (GlobalRandom.next() - .5) + (props.incomingNormalized.y * props.incomingWeight)
            });
            const variedSpread = props.spread * (1 - GlobalRandom.next() * props.spreadVariance);
            const endState = {
                x: 50 + (normalizedRandomDirection.x * variedSpread * 100),
                y: 50 + (normalizedRandomDirection.y * variedSpread * 100),
                scale: props.particleSize * ( 1 - GlobalRandom.next() * props.particleSizeVariance ),
                randHash: GlobalHashPool.next(),
            }
            particles.push(
                props.particleGeneratorFunc(i, 
                    computeParticleAnimation(endState, props.durationMS), props.additionalChildContent()
                )
            );
        }
        return particles;
    }
    const children: JSX.Element[] = props.preComputedParticles ?? generateParticles();

    return (
        <div
            class={css`${baseContainerStyle}
                width: ${props.size}vw; 
                height: ${props.size}vw; 
                top: ${props.coords.y}px; 
                left: ${props.coords.x}px;
                ${props.showParentOutline ? "border: 1px solid red;" : ""}
                ${Styles.ANIM.FADE_OUT(props.durationMS / 900, "ease-out")}` //Slightly slower than duration
            }
        >{children}</div>
    );
}

const baseContainerStyle = css`
    position: absolute;
    contain: paint;
    background: radial-gradient(circle, rgba(0,0,0,1), transparent 70%);
    will-change: contents;
    transform: translate(-50%, -50%);
`;

const computeParticleAnimation = (endState: ParticleEndState, durationMS: number) => css`
    position: absolute;
    will-change: left, top;
    top: 50%;
    left: 50%;
    width: ${endState.scale * 100}%;
    height: ${endState.scale * 100}%;
    ${Styles.TRANSFORM_CENTER}
    transform: translate(-50%, -50%);
    z-index: 1;
    animation: particleMove-${endState.randHash} ${durationMS / 1000}s ease-out;
    @keyframes particleMove-${endState.randHash} {
        from {
            left: 50%;
            top: 50%;
        }
        to {
            left: ${endState.x}%;
            top: ${endState.y}%;
        }
    }
`;