/**
 * The poisition of a point
 * @property x x of point
 * @prop y y of point
 * @interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * The properties of a circle
 * @property center x,y of centerr
 * @prop radius radius of the circle
 * @interface
 */
export interface Circle {
  center: Point;
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
export function getCircle(p1: Point, p2: Point, p3: Point): Circle {
  const e = 2 * (p2.x - p1.x);
  const f = 2 * (p2.y - p1.y);
  const g = p2.x ** 2 - p1.x ** 2 + p2.y ** 2 - p1.y ** 2;

  const a = 2 * (p3.x - p2.x);
  const b = 2 * (p3.y - p2.y);
  const c = p3.x ** 2 - p2.x ** 2 + p3.y ** 2 - p2.y ** 2;

  const x = (g * b - c * f) / (e * b - a * f);
  const y = (a * g - c * e) / (a * f - b * e);
  const radius = Math.sqrt((x - p1.x) * (x - p1.x) + (y - p1.y) * (y - p1.y));

  return { center: { x, y }, radius };
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
function getOrientation(p1: Point, p2: Point, p3: Point): EOrientation {
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

export interface Line {
  p0: Point;
  p1: Point;
}

export interface Arc {
  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getArc(start: Point, end: Point, mid?: Point): Arc | undefined {
  if (mid === undefined) {
    return;
  }
  const orientation = getOrientation(start, mid, end);
  if (orientation === EOrientation.Collinear) {
    return;
  }
  const circle = getCircle(start, mid, end);
  const startAngle = Math.atan2(
    start.y - circle.center.y,
    start.x - circle.center.x,
  );
  const endAngle = Math.atan2(end.y - circle.center.y, end.x - circle.center.x);
  return {
    center: circle.center,
    radius: circle.radius,
    startAngle,
    endAngle,
    anticlockwise: orientation === EOrientation.Counterclockwise,
  };
}

export function getDistance(p0: Point, p1: Point): number {
  const dx = p0.x - p1.x;
  const dy = p0.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
