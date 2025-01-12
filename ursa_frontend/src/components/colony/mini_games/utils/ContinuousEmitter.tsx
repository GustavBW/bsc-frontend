import { Styles } from "@/styles/sharedCSS";
import { createArrayStore } from "@/ts/arrayStore";
import { normalizeVec2, Vec2, Vec2_TWENTY, Vec2_ZERO } from "@/ts/geometry";
import { GlobalHashPool, GlobalRandom } from "@/ts/ursaMath";
import { css } from "@emotion/css";
import { Accessor, createEffect, createMemo, For, onCleanup } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

interface ContinuousEmitterProps {
    /** Where on the screen to place the emitter */
    coords: Vec2;
    /** Whether or not the emitter is on. Reactive. If not provided, the emitter is on. 
     * When turned off, any remaining particles will finish their animation and then be removed.
    */
    active?: Accessor<boolean>;
    /** Turns emitter placement coords from being intepreted in "px" to "%" */
    relativePositioning?: boolean;
    /** size of emitter on each axis in vw @default {x: 20, y: 20} */
    size?: Vec2;
    /** zIndex of emitter @default 1 */
    zIndex?: number;
    /** Particles per second @default 10 */
    spawnRate?: number;
    /** in percent of emitter size (0-1) on all axis @default .05 */
    particleSize?: number;
    /** Up to how much to randomly subtract from particleSize where 0 is 0% and 1 is 100%
     * @default .1 */
    particleSizeVariance?: number;
    /** Normalized direction @default {x: 0 y: -1} (upwards) */
    direction?: Accessor<Vec2>;
    /** Up to how much to randomly vary the direction vector, in percent (0-1). 
     * Where 1 makes the direction of each particle completely random @default .2 */
    spread?: number;
    /** How fast should the particle reach the end of its animation, in seconds @default 5 */
    travelTime?: number;
    /** Up to how much to reduce travelTime in percent (0-1) per particle @default .3 */
    travelTimeVariance?: number;
    /** How far should each particle travel as percent of emitter size (0-1) @default 1 */
    travelLength?: number;
    /** Up to how much to randomly reduce travelLength in percent (0-1) per particle @default .3 */
    travelLengthVariance?: number;
    /** What interpolation to use for moving each particle @default "linear" */
    movementIntepolation?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    /** In percent of travel time: When to begin fading out the individual particle. @default .3 */
    fadeoutStart?: number;
    /** Up to how much to randomly vary fadeoutStart @default .1 */
    fadeoutStartVariance?: number;
    /** Up to how much to randomly offset the starting position of each particle
     * along the orthogonal to the direction vector, in percent of emitter size (0-1) @default 0
     */
    spawnOffsetVariance?: number;
    /** How many particles to pre-compute and pool for later use. 
     * May increase performance or make performance more consistent.
     * However, any pre-computed particles will not be reactive to changes in settings.
     * @default 0 (disabled) */
    particlePoolSize?: number;
    showEmitterOutline?: boolean;
    /** EXPENSIVE. Additional content to include for each particle */
    additionalParticleContent?: (particle: ComputeData) => JSX.Element;
    /** EXPENSIVE. For each particle, for each unit of time, generate some additional/alternative
     * styling to apply to the particle. For clarification: The overall computed animation is applied
     * to a parent of each particle and cannot be interferred with. NOT IMPLIMENTED. */
    particleModulator?: (data: ModulatorData) => string;
    /** Fragile. 
     * @param animation The computed animation style for the particle. Must be applied as the "class" prop. Unique. Volatile.
     * @param children Any contents. Should at all times be included.
     * @param data The computed data for the particle. 
     * 
     * Any additional style should be applied through the "style" prop. Careful not overwrite properties like 
     * width, height, top, left & opacity, which are used for the animation as "style" takes precendance over "class"
     */
    generatorFunc?: (data: ComputeData, animation: string, children: JSX.Element) => JSX.Element;
}

interface ComputeData {
    travelTimeS: number;
    sizePercentOfParent: number;
    fadeoutStartPercentOfTime: number;
    /** linear / ease-out / ease-in etc */
    movementInterpolation: string;
    /** start position in percent of parent dimensions */
    startPercent: Vec2;
    /** end position in percent of parent dimensions */
    endPercent: Vec2;
    randHash: string;
    /** Particle number */
    index: number;
}

/** Data pertaining to some particle to be used for continuous mutation while the particle is spawned */
interface ModulatorData extends ComputeData {
    /** How many times this particle have been re-evaluated by this modulator function */
    evalCount: number;
    /** how far the particle is in its lifetime in percent (0-1). */
    completion: number;
}

interface ParticleData {
    preComputed: ComputeData;
    element: JSX.Element;
    parentAnimation: string;
}

export const NULL_JSX: JSX.Element = <></>;
const defaults: Omit<Required<ContinuousEmitterProps>, 'particleModulator' | 'active' > & Partial<Pick<ContinuousEmitterProps, 'particleModulator'>> = {
    coords: Vec2_ZERO,
    relativePositioning: false,
    zIndex: 1,
    size: Vec2_TWENTY,
    spawnRate: 10,
    particleSize: .05,
    particleSizeVariance: .1,
    direction: () => ({ x: 0, y: -1 }),
    spread: .2,
    travelTime: 5,
    travelTimeVariance: .3,
    travelLength: 1,
    travelLengthVariance: .3,
    fadeoutStart: .3,
    fadeoutStartVariance: .1,
    spawnOffsetVariance: 0,
    movementIntepolation: "linear",
    showEmitterOutline: false,
    particlePoolSize: 0,
    additionalParticleContent: () => NULL_JSX,
    generatorFunc: (i, a, c) => <div class={a}>{c}</div>
}
/** Mapping from [-1, 1] to [0, 1] */
const mapToCSSPercentSpace = (vec: Vec2): Vec2 => ({ x: .5 + (vec.x * .5), y: .5 + (vec.y * .5) });

export default function ContinuousEmitter(rawProps: ContinuousEmitterProps) {
    const props = Object.assign({}, defaults, rawProps); // signals passed from rawProps remain reactive
    const particles = createArrayStore<ParticleData>([]);

    const orthogonal = createMemo(() => {
        const dir = props.direction();
        return {
            x: -dir.y,
            y: dir.x
        }
    })

    let nextParticleIndex = 0;
    const generateParticle = () => {
        const lengthPercentOfParent = props.travelLength * (1 - GlobalRandom.next() * props.travelLengthVariance);
        const travelSpeedS = props.travelTime * (1 - GlobalRandom.next() * props.travelTimeVariance);
        const sizePercentOfParent = props.particleSize * (1 - GlobalRandom.next() * props.particleSizeVariance);
        const fadeoutStartPercentOfTime = props.fadeoutStart * (1 - GlobalRandom.next() * props.fadeoutStartVariance);
        const dir = props.direction();
        const computedDirection = normalizeVec2({
            // Direction is weighted towards the random vector, but equally diminishing the original vector
            // for completely random direction at spread = 1. 
            x: (dir.x * (1 - props.spread)) + ((GlobalRandom.next() * 2 - 1) * props.spread),
            y: (dir.y * (1 - props.spread)) + ((GlobalRandom.next() * 2 - 1) * props.spread)
        })
        const orth = orthogonal();
        // Mapping random weight to [-1, 1] and multiplying by offset weight
        const startVariance = (GlobalRandom.next() * 2 - 1) * props.spawnOffsetVariance;
        const spawnOffsetRelative = {
            x: orth.x * startVariance, //"sliding" a point along the orthogonal vector
            y: orth.y * startVariance
        }
        const endPositionPercent = { // adding spawn offset to have each particle maintain its path
            x: spawnOffsetRelative.x + computedDirection.x * lengthPercentOfParent,
            y: spawnOffsetRelative.y + computedDirection.y * lengthPercentOfParent
        }

        const computeData: ComputeData = {
            index: nextParticleIndex++,
            travelTimeS: travelSpeedS,
            sizePercentOfParent,
            fadeoutStartPercentOfTime,
            movementInterpolation: props.movementIntepolation,
            startPercent: mapToCSSPercentSpace(spawnOffsetRelative),
            endPercent: mapToCSSPercentSpace(endPositionPercent),
            randHash: GlobalHashPool.next()
        }

        const animation = computeParticleStyles(computeData);
        const element = props.generatorFunc(computeData, animation, props.additionalParticleContent(computeData));

        const particle: ParticleData = {
            preComputed: computeData,
            parentAnimation: animation,
            element
        }

        const removeFunc = particles.add(particle);
        setTimeout(removeFunc, travelSpeedS * 1000);
    }

    let interval: NodeJS.Timeout | undefined;
    createEffect(() => {
        // Access the active signal directly to track it
        const isActive = props.active?.() ?? true;
        
        // Clean up existing interval if any
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }

        // Start new interval if active
        if (isActive) {
            interval = setInterval(generateParticle, 1000 / props.spawnRate);
        }
    })

    onCleanup(() => {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    });

    return (
        <div class={css`${baseContainerStyle}
            width: ${props.size.x}vw; 
            height: ${props.size.y}vw; 
            top: ${props.coords.y}${props.relativePositioning ? "%" : "px"}; 
            left: ${props.coords.x}${props.relativePositioning ? "%" : "px"};
            z-index: ${props.zIndex};
            ${props.showEmitterOutline ? "border: 1px solid red;" : ""}`
        }>
            <For each={particles.get}>{ particle => particle.element }</For>
        </div>
    );
}

const computeParticleStyles = (data: ComputeData) => css`
    position: absolute;
    will-change: left, top, opacity;
    top: ${data.startPercent.y * 100}%;
    left: ${data.startPercent.x * 100}%;
    ${Styles.POSITION.TRANSFORM_CENTER}
    width: ${data.sizePercentOfParent * 100}%;
    height: ${data.sizePercentOfParent * 100}%;
    z-index: 1;
    opacity: 1;
    animation-name: particleMove-${data.randHash}, particleFade-${data.randHash};
    animation-delay: 0s, ${data.travelTimeS * data.fadeoutStartPercentOfTime}s;
    animation-duration: ${data.travelTimeS}s, ${data.travelTimeS * (1 - data.fadeoutStartPercentOfTime)}s;
    animation-timing-function: ${data.movementInterpolation}, linear;
    @keyframes particleMove-${data.randHash} {
        from {
            left: ${data.startPercent.x * 100}%;
            top: ${data.startPercent.y * 100}%;
        }
        to {
            left: ${data.endPercent.x * 100}%;
            top: ${data.endPercent.y * 100}%;
        }
    }
    @keyframes particleFade-${data.randHash} {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`

const baseContainerStyle = css`
    position: absolute;
    contain: paint;
    will-change: contents;
    transform: translate(-50%, -50%);
`;