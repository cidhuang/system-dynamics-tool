import { Container, DisplayObject, Text } from "pixi.js";
import { Point, Link, indexOf } from "./types";
import { ViewEdge } from "./ViewEdge";

export function addViewLink(
  stage: Container<DisplayObject>,
  name: string,
  start: Point,
  end: Point,
) {
  //console.log(link);
  const edge = new ViewEdge(start, end);
  edge.name = name;
  edge.color = "grey";
  edge.width = 8;
  edge.arrowHeadLength = 15;
  edge.isDashed = true;
  edge.isPolyline = false;
  stage.addChild(edge);
}

export function updateViewLink(
  stage: Container<DisplayObject>,
  name: string,
  start: Point,
  end: Point,
  mid?: Point,
): boolean {
  const index = indexOf(stage.children, name);
  if (index < 0) {
    return false;
  }

  const view = stage.children[index] as ViewEdge;
  view.start = start;
  view.end = end;
  view.mid = mid;

  return true;
}

export function isOnLink(item: DisplayObject, xy: Point): boolean {
  const edge = item as ViewEdge;
  return edge.contains(xy.x, xy.y);
}
