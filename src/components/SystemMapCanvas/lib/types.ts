import {
  Point,
  getOrientation,
  getCircle,
  EOrientation,
  Circle,
  toDegree,
} from "./geometry";

export function indexOf(array: any[], name: string): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      return i;
    }
  }
  return -1;
}

function genName(array: any[], prefix: string): string {
  let i = 0;
  while (indexOf(array, prefix + i.toString()) >= 0) {
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

export function getPoint4View(
  variable0: Variable,
  p1: Point,
  mid?: Point,
): Point {
  const charWidth = 7;
  const charHeight = 20;

  const p0 = variable0.xy;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const slope = dy / dx;

  const strings0 = variable0.text.split("\n");
  const width0 =
    charWidth *
    strings0.reduce((str0, str1) => {
      return str0.length > str1.length ? str0 : str1;
    }).length;
  const height0 = charHeight * strings0.length;

  let point = structuredClone(p0);

  const orientation =
    mid !== undefined ? getOrientation(p0, p1, mid) : undefined;

  if (
    mid === undefined ||
    orientation === undefined ||
    orientation === EOrientation.Collinear
  ) {
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

  const circle = getCircle(p0, p1, mid);
  const angle0 = Math.atan2(p0.y - circle.center.y, p0.x - circle.center.x);
  const angle1 = Math.atan2(p1.y - circle.center.y, p1.x - circle.center.x);

  const x0 = p0.x - width0;
  const x1 = p0.x + width0;
  const y0 = p0.y - height0;
  const y1 = p0.y + height0;

  if (mid.x >= x0 && mid.x <= x1 && mid.y >= y0 && mid.y <= y1) {
    return point;
  }

  const x0Data = getPointX(x0, circle);
  const x1Data = getPointX(x1, circle);
  const y0Data = getPointY(y0, circle);
  const y1Data = getPointY(y1, circle);

  let tmp = [];
  tmp.push({ x: x0, y: x0Data.y0, angle: x0Data.angle0 });
  tmp.push({ x: x0, y: x0Data.y1, angle: x0Data.angle1 });
  tmp.push({ x: x1, y: x1Data.y0, angle: x1Data.angle0 });
  tmp.push({ x: x1, y: x1Data.y1, angle: x1Data.angle1 });
  tmp.push({ x: y0Data.x0, y: y0, angle: y0Data.angle0 });
  tmp.push({ x: y0Data.x1, y: y0, angle: y0Data.angle1 });
  tmp.push({ x: y1Data.x0, y: y1, angle: y1Data.angle0 });
  tmp.push({ x: y1Data.x1, y: y1, angle: y1Data.angle1 });

  const tmp2 = tmp.filter((item) => {
    return item.x >= x0 && item.x <= x1 && item.y >= y0 && item.y <= y1;
  });

  if (orientation == EOrientation.Clockwise) {
    if (tmp2[0].angle < angle0 && tmp2[0].angle > angle1) {
      return { x: tmp2[0].x, y: tmp2[0].y };
    }
    if (tmp2[0].angle > angle0 && tmp2[0].angle < angle1) {
      return { x: tmp2[1].x, y: tmp2[1].y };
    }
    if (tmp2[1].angle < angle0 && tmp2[1].angle > angle1) {
      return { x: tmp2[1].x, y: tmp2[1].y };
    }
    if (tmp2[1].angle > angle0 && tmp2[1].angle < angle1) {
      return { x: tmp2[0].x, y: tmp2[0].y };
    }
  } else {
    if (tmp2[0].angle < angle0 && tmp2[0].angle > angle1) {
      return { x: tmp2[1].x, y: tmp2[1].y };
    }
    if (tmp2[0].angle > angle0 && tmp2[0].angle < angle1) {
      return { x: tmp2[0].x, y: tmp2[0].y };
    }
    if (tmp2[1].angle < angle0 && tmp2[1].angle > angle1) {
      return { x: tmp2[0].x, y: tmp2[0].y };
    }
    if (tmp2[1].angle > angle0 && tmp2[1].angle < angle1) {
      return { x: tmp2[1].x, y: tmp2[1].y };
    }
  }

  return point;
}

function getPointX(
  x: number,
  circle: Circle,
): { y0: number; angle0: number; y1: number; angle1: number } {
  const r = Math.sqrt(
    circle.radius * circle.radius -
      (x - circle.center.x) * (x - circle.center.x),
  );
  const y0 = circle.center.y + r;
  const y1 = circle.center.y - r;

  const angle0 = Math.atan2(y0 - circle.center.y, x - circle.center.x);
  const angle1 = Math.atan2(y1 - circle.center.y, x - circle.center.x);

  return { y0, angle0, y1, angle1 };
}

function getPointY(
  y: number,
  circle: Circle,
): { x0: number; angle0: number; x1: number; angle1: number } {
  const r = Math.sqrt(
    circle.radius * circle.radius -
      (y - circle.center.y) * (y - circle.center.y),
  );
  const x0 = circle.center.x + r;
  const x1 = circle.center.x - r;

  const angle0 = Math.atan2(y - circle.center.y, x0 - circle.center.x);
  const angle1 = Math.atan2(y - circle.center.y, x1 - circle.center.x);

  return { x0, angle0, x1, angle1 };
}
