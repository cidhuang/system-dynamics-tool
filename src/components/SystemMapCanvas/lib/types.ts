import { Point, getArc } from "./geometry";

function genName(array: any[], prefix: string): string {
  let i = 0;
  while (array.findIndex((item) => item.name === prefix + i.toString()) >= 0) {
    i++;
  }

  return prefix + i.toString();
}

export interface Variable {
  name: string;
  text: string;
  xy: Point;
}

export function isVariable(name: string): boolean {
  return name.startsWith("variable-");
}

export function createVariable(variables: Variable[], xy: Point): string {
  const name = genName(variables, "variable-");
  variables.push({
    name,
    text: name,
    xy,
  });

  return name;
}

export interface Stock {
  name: string;
  text: string;
  xy: Point;
}

export function isStock(name: string): boolean {
  return name.startsWith("stock-");
}

export function createStock(stocks: Stock[], xy: Point): string {
  const name = genName(stocks, "stock-");
  stocks.push({
    name,
    text: name,
    xy,
  });

  return name;
}

export interface Link {
  name: string;
  isPlus: boolean;
  start: string;
  end: string;
  mid?: Point;
}

export function isLink(name: string): boolean {
  return name.startsWith("link-");
}

export function createLink(
  links: Link[],
  start: string,
  end: string,
  isPlus: boolean = true,
  mid?: Point,
): string {
  const name = genName(links, "link-");
  links.push({
    name,
    isPlus,
    start,
    end,
    mid,
  });

  return name;
}

export interface Flow {
  name: string;
  start: string | Point;
  end: string | Point;
  valve?: Point;
}

export function isFlow(name: string): boolean {
  return name.startsWith("flow-");
}

export function createFlow(
  flows: Flow[],
  start: string | Point,
  end: string | Point,
  valve?: Point,
): string {
  if (typeof start !== "string" && typeof end !== "string") {
    return "";
  }
  const name = genName(flows, "flow-");
  flows.push({
    name,
    start,
    end,
    valve,
  });

  return name;
}

export interface IItems {
  variables: Variable[];
  links: Link[];
  stocks: Stock[];
  flows: Flow[];
}

export function getIntersection(
  node0: Variable | Stock,
  p1: Point,
  mid?: Point,
): Point {
  const charWidth = 7;
  const charHeight = 20;

  const p0 = node0.xy;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const slope = dy / dx;

  const padding = isStock(node0.name) ? 10 : 0;
  const strings0 = node0.text.split("\n");
  const width0 =
    padding * 2 +
    charWidth *
      strings0.reduce((str0, str1) => {
        return str0.length > str1.length ? str0 : str1;
      }).length;
  const height0 = padding * 2 + charHeight * strings0.length;

  let point = structuredClone(p0);

  const arc = getArc(p0, p1, mid);

  if (mid === undefined || arc === undefined) {
    const slope0 = height0 / width0;

    const dx0 = height0 / slope;
    const dy0 = width0 * slope;

    if (dx === 0) {
      if (dy > 0) {
        point.y += height0;
      }

      if (dy < 0) {
        point.y -= height0;
      }
    } else if (dx > 0) {
      if (slope > 0) {
        if (slope0 > slope) {
          point.x += width0;
          point.y += dy0;
        } else {
          point.x += dx0;
          point.y += height0;
        }
      } else {
        if (slope0 > -slope) {
          point.x += width0;
          point.y += dy0;
        } else {
          point.x -= dx0;
          point.y -= height0;
        }
      }
    } else {
      if (slope > 0) {
        if (slope0 > slope) {
          point.x -= width0;
          point.y -= dy0;
        } else {
          point.x -= dx0;
          point.y -= height0;
        }
      } else {
        if (slope0 > -slope) {
          point.x -= width0;
          point.y -= dy0;
        } else {
          point.x += dx0;
          point.y += height0;
        }
      }
    }

    return point;
  }

  const x0 = p0.x - width0;
  const x1 = p0.x + width0;
  const y0 = p0.y - height0;
  const y1 = p0.y + height0;

  if (mid.x >= x0 && mid.x <= x1 && mid.y >= y0 && mid.y <= y1) {
    return point;
  }

  const x0Ints = getIntersections4X(x0, arc.center, arc.radius);
  const x1Ints = getIntersections4X(x1, arc.center, arc.radius);
  const y0Ints = getIntersections4Y(y0, arc.center, arc.radius);
  const y1Ints = getIntersections4Y(y1, arc.center, arc.radius);

  let angles = [];
  angles.push({ x: x0, y: x0Ints[0].y, angle: x0Ints[0].angle });
  angles.push({ x: x0, y: x0Ints[1].y, angle: x0Ints[1].angle });
  angles.push({ x: x1, y: x1Ints[0].y, angle: x1Ints[0].angle });
  angles.push({ x: x1, y: x1Ints[1].y, angle: x1Ints[1].angle });
  angles.push({ x: y0Ints[0].x, y: y0, angle: y0Ints[0].angle });
  angles.push({ x: y0Ints[1].x, y: y0, angle: y0Ints[1].angle });
  angles.push({ x: y1Ints[0].x, y: y1, angle: y1Ints[0].angle });
  angles.push({ x: y1Ints[1].x, y: y1, angle: y1Ints[1].angle });

  const ints = angles.filter((item) => {
    return item.x >= x0 && item.x <= x1 && item.y >= y0 && item.y <= y1;
  });

  const i0 = arc.anticlockwise ? 0 : 1;
  const i1 = arc.anticlockwise ? 1 : 0;

  if (ints[i0].angle < arc.startAngle && ints[i0].angle > arc.endAngle) {
    return { x: ints[0].x, y: ints[0].y };
  }
  if (ints[i0].angle > arc.startAngle && ints[i0].angle < arc.endAngle) {
    return { x: ints[1].x, y: ints[1].y };
  }
  if (ints[i1].angle < arc.startAngle && ints[i1].angle > arc.endAngle) {
    return { x: ints[1].x, y: ints[1].y };
  }
  if (ints[i1].angle > arc.startAngle && ints[i1].angle < arc.endAngle) {
    return { x: ints[0].x, y: ints[0].y };
  }

  return point;
}

function getIntersections4X(
  x: number,
  center: Point,
  radius: number,
): [{ y: number; angle: number }, { y: number; angle: number }] {
  const r = Math.sqrt(radius * radius - (x - center.x) * (x - center.x));
  const y0 = center.y + r;
  const y1 = center.y - r;

  const angle0 = Math.atan2(y0 - center.y, x - center.x);
  const angle1 = Math.atan2(y1 - center.y, x - center.x);

  return [
    { y: y0, angle: angle0 },
    { y: y1, angle: angle1 },
  ];
}

function getIntersections4Y(
  y: number,
  center: Point,
  radius: number,
): [{ x: number; angle: number }, { x: number; angle: number }] {
  const r = Math.sqrt(radius * radius - (y - center.y) * (y - center.y));
  const x0 = center.x + r;
  const x1 = center.x - r;

  const angle0 = Math.atan2(y - center.y, x0 - center.x);
  const angle1 = Math.atan2(y - center.y, x1 - center.x);

  return [
    { x: x0, angle: angle0 },
    { x: x1, angle: angle1 },
  ];
}
