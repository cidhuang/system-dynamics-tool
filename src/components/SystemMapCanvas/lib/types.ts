import { Point } from "./geometry";

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
  const slope0 = height0 / width0;

  const dx0 = height0 / slope;
  const dy0 = width0 * slope;

  let point = structuredClone(p0);

  if (mid === undefined) {
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
  }

  return point;
}
