
export type Vec2 = { x: number; y: number };
export const Vec2_ZERO: Vec2 = { x: 0, y: 0 };
export const Vec2_ONE: Vec2 = { x: 1, y: 1 };

export function normalizeVec2(vec: Vec2): Vec2 {
    const mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return { x: vec.x / mag, y: vec.y / mag };
}

export type Line = { x1: number; y1: number; x2: number; y2: number };