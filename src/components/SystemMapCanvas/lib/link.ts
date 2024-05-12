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
  edge.width = 4;
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

export function nameLink(
  stage: Container<DisplayObject>,
  links: Link[],
  xy: Point,
): string {
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const index = indexOf(stage.children, link.name);
    if (index < 0) {
      continue;
    }

    const child = stage.children[index];
    if (child.name === null) {
      alert("item no name");
      continue;
    }
    const bounds = child.getBounds();
    //console.log(xy, bounds);
    if (
      xy.x >= bounds.left &&
      xy.x <= bounds.right &&
      xy.y >= bounds.top &&
      xy.y <= bounds.bottom
    ) {
      return child.name;
    }
  }

  return "";
}
