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

export function nameVariable(
  stage: Container<DisplayObject>,
  variables: Variable[],
  xy: Point,
): string {
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const index = indexOf(stage.children, variable.name);
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
