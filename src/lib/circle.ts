//import type { Point } from 'pixi.js';

export interface Point {
  x: number;
  y: number;
}

export function getCircle(
  p1: Point,
  p2: Point,
  p3: Point
): {
  cx: number;
  cy: number;
  radius: number;
} {
  // https://www.twblogs.net/a/5b7afab12b7177539c24854c
  const e = 2 * (p2.x - p1.x);
  const f = 2 * (p2.y - p1.y);
  const g = p2.x ** 2 - p1.x ** 2 + p2.y ** 2 - p1.y ** 2;

  const a = 2 * (p3.x - p2.x);
  const b = 2 * (p3.y - p2.y);
  const c = p3.x ** 2 - p2.x ** 2 + p3.y ** 2 - p2.y ** 2;

  const cx = (g * b - c * f) / (e * b - a * f);
  const cy = (a * g - c * e) / (a * f - b * e);
  const radius = Math.sqrt(
    (cx - p1.x) * (cx - p1.x) + (cy - p1.y) * (cy - p1.y)
  );

  return { cx, cy, radius };
}

export enum Orientation {
  Collinear,
  Clockwise,
  Counterclockwise,
}

export function getOrientation(p1: Point, p2: Point, p3: Point): Orientation {
  // https://www.geeksforgeeks.org/orientation-3-ordered-points/

  // See 10th slides from following link
  // for derivation of the formula
  const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);

  if (val === 0) {
    return Orientation.Collinear; // collinear
  }

  // clock or counterclock wise
  return val < 0 ? Orientation.Clockwise : Orientation.Counterclockwise;
}

export function toDegree(angle: number): number {
  return (angle * 180) / Math.PI;
}
/*
export function indexOf(array: any[], name: string): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      return i;
    }
  }
  return -1;
}
*/