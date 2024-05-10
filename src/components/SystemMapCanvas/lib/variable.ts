import { Container, DisplayObject, Text } from "pixi.js";
import { Point, Variable, indexOf } from "./types";

export function addViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
) {
  //console.log(variable);
  let text = new Text(variable.text);
  text.name = variable.name;
  text.style.align = "center";
  text.style.fill = "black";
  text.x = variable.xy.x;
  text.y = variable.xy.y;
  text.style.fill = "black";
  text.style.fontWeight = "normal";

  stage.addChild(text);
}

export function updateViewVariable(
  stage: Container<DisplayObject>,
  variable: Variable,
): boolean {
  const index = indexOf(stage.children, variable.name);
  if (index < 0) {
    return false;
  }

  const text = stage.children[index] as Text;
  text.x = variable.xy.x;
  text.y = variable.xy.y;
  text.style.fill = "black";
  text.style.fontWeight = "normal";

  return true;
}