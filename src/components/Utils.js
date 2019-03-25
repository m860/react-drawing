import type {PathType, Point} from "./Types";

export function generatePathForLineWithArrow(begin: Point, end: Point, distance: number): Array<PathType> {
    const diffX = begin.x - end.x;
    const diffY = begin.y - end.y;
    const a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    const ex = diffX / a;
    const ey = diffY / a;

    const q2x = end.x + ex * distance;
    const q2y = end.y + ey * distance;

    const fx = Math.cos(Math.PI / 2) * ex + Math.sin(Math.PI / 2) * ey;
    const fy = -Math.sin(Math.PI / 2) * ex + Math.cos(Math.PI / 2) * ey;
    const q1x = q2x + fx * distance * 0.5;
    const q1y = q2y + fy * distance * 0.5;

    const gx = Math.cos(-Math.PI / 2) * ex + Math.sin(-Math.PI / 2) * ey;
    const gy = -Math.sin(-Math.PI / 2) * ex + Math.cos(-Math.PI / 2) * ey;
    const q3x = q2x + gx * distance * 0.5;
    const q3y = q2y + gy * distance * 0.5;

    return [
        {action: "M", x: begin.x, y: begin.y},
        {action: "L", x: q2x, y: q2y},
        {action: "L", x: q1x, y: q1y},
        {action: "L", x: end.x, y: end.y},
        {action: "L", x: q3x, y: q3y},
        {action: "L", x: q2x, y: q2y},
        {action: "L", x: begin.x, y: begin.y},
        {action: "Z"}
    ];
}