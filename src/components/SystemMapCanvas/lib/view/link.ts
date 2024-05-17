import { Container, DisplayObject, Text } from "pixi.js";
import { ViewEdge } from "./ViewEdge";
import { Point } from "../geometry";

export function addViewLink(
  stage: Container<DisplayObject>,
  name: string,
  start: Point,
  end: Point,
) {
  const edge = new ViewEdge(start, end);
  edge.name = name;
  edge.color = "grey";
  edge.width = 8;
  edge.arrowHeadLength = 15;
  edge.isDashed = false;
  edge.isPolyline = false;
  stage.addChild(edge);
}

export function updateViewLink(
  stage: Container<DisplayObject>,
  name: string,
  isPlus: boolean,
  start: Point,
  end: Point,
  mid?: Point,
): boolean {
  const item = stage.children.find((child) => child.name === name);
  if (item === undefined) {
    return false;
  }

  const view = item as ViewEdge;
  view.isDashed = !isPlus;
  view.start = start;
  view.end = end;
  view.mid = mid;

  return true;
}

export function isOnLink(item: DisplayObject, xy: Point): boolean {
  const edge = item as ViewEdge;
  return edge.contains(xy.x, xy.y);
}
