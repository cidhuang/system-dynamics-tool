import { Container, DisplayObject } from "pixi.js";
import { Stock } from "../types";
import { Point } from "../geometry";
import { EBackgroundShape, ViewNode } from "./ViewNode";

export function addViewStock(stage: Container<DisplayObject>, stock: Stock) {
  let item = new ViewNode(stock.xy, stock.text);
  item.name = stock.name;
  item.backgroundShape = EBackgroundShape.Rectangle;
  stage.addChild(item);
}

export function updateViewStock(
  stage: Container<DisplayObject>,
  stock: Stock,
): boolean {
  const item = stage.children.find(
    (child) => child.name === stock.name,
  ) as ViewNode;
  if (item === undefined) {
    return false;
  }

  item.text = stock.text;
  item.x = stock.xy.x;
  item.y = stock.xy.y;

  return true;
}

export function isOnStock(item: DisplayObject, xy: Point): boolean {
  return (item as ViewNode).contains(xy.x, xy.y);
}
