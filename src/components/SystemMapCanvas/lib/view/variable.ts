import { Container, DisplayObject } from "pixi.js";
import { Variable } from "../types";
import { Point } from "../geometry";
import { ViewNode } from "./ViewNode";

export function addViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
) {
  let item = new ViewNode(variable.xy, variable.text);
  item.name = variable.name;
  stage.addChild(item);
}

export function updateViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
): boolean {
  const item = stage.children.find(
    (child) => child.name === variable.name,
  ) as ViewNode;
  if (item === undefined) {
    return false;
  }

  item.text = variable.text;
  item.x = variable.xy.x;
  item.y = variable.xy.y;

  return true;
}

export function isOnVariable(item: DisplayObject, xy: Point): boolean {
  return (item as ViewNode).contains(xy.x, xy.y);
}
