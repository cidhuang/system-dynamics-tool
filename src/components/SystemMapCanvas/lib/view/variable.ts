import { Container, DisplayObject, Rectangle, Text } from "pixi.js";
import { Variable } from "../types";
import { Point } from "../geometry";

export function addViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
) {
  let text = new Text(variable.text);
  text.name = variable.name;
  text.style.align = "center";
  text.style.fill = "black";
  text.x = variable.xy.x - text.width / 2;
  text.y = variable.xy.y - text.height / 2;
  text.style.fill = "black";
  text.style.fontWeight = "normal";

  stage.addChild(text);
}

export function updateViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
): boolean {
  const item = stage.children.find((child) => child.name === variable.name);
  if (item === undefined) {
    return false;
  }

  const text = item as Text;
  text.text = variable.text;
  text.x = variable.xy.x - text.width / 2;
  text.y = variable.xy.y - text.height / 2;
  text.style.fill = "black";
  text.style.fontWeight = "normal";

  return true;
}

export function isOnVariable(item: DisplayObject, xy: Point): boolean {
  const bounds = getVariableBounds(item);

  if (
    xy.x >= bounds.left &&
    xy.x <= bounds.right &&
    xy.y >= bounds.top &&
    xy.y <= bounds.bottom
  ) {
    return true;
  }

  return false;
}

export function getVariableBounds(item: DisplayObject): Rectangle {
  const text = item as Text;
  return text.getBounds();
}

export function getVariableText(item: DisplayObject): string {
  const text = item as Text;
  return text.text;
}
