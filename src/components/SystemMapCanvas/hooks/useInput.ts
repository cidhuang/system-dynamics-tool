import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Application, ICanvas } from "pixi.js";

import { isStock, isVariable } from "../lib/types";

import { Point } from "../lib/geometry";
import { ViewNode } from "../lib/view/ViewNode";

export function useInput(
  app: Application<ICanvas> | undefined,
  editingText: string,
  setEditingText: Dispatch<SetStateAction<string>>,
): [Point, boolean, string, number, number, Dispatch<SetStateAction<boolean>>] {
  const [inputPosition, setInputPosition] = useState<Point>({ x: 0, y: 0 });
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputWidth, setInputWidth] = useState<number>(100);
  const [inputHeight, setInputHeight] = useState<number>(100);

  useEffect(() => {
    if (app === undefined) {
      return;
    }

    if (!isVariable(editingText) && !isStock(editingText)) {
      setEditingText("");
      return;
    }

    const item = app.stage.children.find(
      (child) => child.name === editingText,
    ) as ViewNode;
    if (item === undefined) {
      return;
    }
    const bounds = item.getBounds();

    setInputWidth(Math.max(300, bounds.width));
    setInputHeight(bounds.height);
    setInputValue(item.text);
    setInputPosition({ x: bounds.x, y: bounds.y });
    setInputVisible(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingText]);

  return [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ];
}
