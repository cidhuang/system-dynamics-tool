import type { Point } from "./types";

/**
 * The properties of a circle
 * @property x x of center
 * @prop y y of center
 * @prop radius radius of the circle
 * @interface
 */
export interface ICircle {
  x: number;
  y: number;
  radius: number;
}

/**
 * Get the center and raius of a circle formed by 3 points.
 *
 * Reference: https://www.twblogs.net/a/5b7afab12b7177539c24854c
 * @param p1 - the 1st point
 * @param p2 - the 2nd point
 * @param p3 - the 3rd point
 * @returns - the circle formed by 3 points.
 */
export function getCircle(p1: Point, p2: Point, p3: Point): ICircle {
  const e = 2 * (p2.x - p1.x);
  const f = 2 * (p2.y - p1.y);
  const g = p2.x ** 2 - p1.x ** 2 + p2.y ** 2 - p1.y ** 2;

  const a = 2 * (p3.x - p2.x);
  const b = 2 * (p3.y - p2.y);
  const c = p3.x ** 2 - p2.x ** 2 + p3.y ** 2 - p2.y ** 2;

  const x = (g * b - c * f) / (e * b - a * f);
  const y = (a * g - c * e) / (a * f - b * e);
  const radius = Math.sqrt((x - p1.x) * (x - p1.x) + (y - p1.y) * (y - p1.y));

  return { x, y, radius };
}

/**
 * The output of function getOrientation.
 *
 * The orientation of 3 points.
 */
export enum EOrientation {
  Collinear,
  Clockwise,
  Counterclockwise,
}

/**
 * Get the orientation of 3 points.
 *
 * Reference: https://www.geeksforgeeks.org/orientation-3-ordered-points/
 * @param p1 - the 1st point
 * @param p2 - the 2nd point
 * @param p3 - the 3rd point
 * @returns - the orientation of 3 points
 */
export function getOrientation(p1: Point, p2: Point, p3: Point): EOrientation {
  const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);

  if (val === 0) {
    return EOrientation.Collinear; // collinear
  }

  // clock or counterclock wise
  return val < 0 ? EOrientation.Clockwise : EOrientation.Counterclockwise;
}

/**
 * Get the degree value of angle.
 * @param angle - angle value
 * @returns - degree value
 */
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
