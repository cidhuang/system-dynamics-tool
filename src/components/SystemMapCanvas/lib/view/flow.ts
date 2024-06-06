import { Container, DisplayObject, Text } from "pixi.js";
import { ViewEdge } from "./ViewEdge";
import { Point } from "../geometry";
import { Flow } from "../types";

export function addViewFlow(
  stage: Container<DisplayObject>,
  flow: Flow,
  start: Point,
  end: Point,
) {
  const edge = flow.valve
    ? new ViewEdge(start, end, flow.valve)
    : new ViewEdge(start, end);
  edge.name = flow.name;
  edge.color = "grey";
  edge.width = 12;
  edge.innerWidth = 8;
  edge.arrowHeadLength = 15;
  edge.isPolyline = true;
  stage.addChild(edge);
}

export function updateViewLink(
  stage: Container<DisplayObject>,
  flow: Flow,
  start: Point,
  end: Point,
): boolean {
  const item = stage.children.find((child) => child.name === flow.name);
  if (item === undefined) {
    return false;
  }

  const view = item as ViewEdge;
  view.start = start;
  view.end = end;
  view.mid = flow.valve;

  return true;
}

export function isOnFlow(item: DisplayObject, xy: Point): boolean {
  const edge = item as ViewEdge;
  return edge.contains(xy.x, xy.y);
}
