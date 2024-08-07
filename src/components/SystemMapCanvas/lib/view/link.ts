import { Container, DisplayObject, Text } from "pixi.js";
import { ViewLink } from "./ViewLink";
import { Point } from "../geometry";
import { Link } from "../types";

export function addViewLink(
  stage: Container<DisplayObject>,
  link: Link,
  start: Point,
  end: Point,
) {
  const edge = link.mid
    ? new ViewLink(start, end, link.mid)
    : new ViewLink(start, end);
  edge.name = link.name;
  edge.color = "grey";
  edge.width = 8;
  edge.arrowHeadLength = 15;
  edge.isDashed = !link.isPlus;
  edge.isWithTimeDelay = false;
  stage.addChild(edge);
}

export function updateViewLink(
  stage: Container<DisplayObject>,
  link: Link,
  start: Point,
  end: Point,
): boolean {
  const item = stage.children.find((child) => child.name === link.name);
  if (item === undefined) {
    return false;
  }

  const view = item as ViewLink;
  view.isDashed = !link.isPlus;
  view.isWithTimeDelay = link.isWithTimeDelay;
  view.start = start;
  view.end = end;
  view.mid = link.mid;

  return true;
}

export function isOnLink(item: DisplayObject, xy: Point): boolean {
  const edge = item as ViewLink;
  return edge.contains(xy.x, xy.y);
}
