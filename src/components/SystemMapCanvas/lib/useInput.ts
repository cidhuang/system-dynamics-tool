import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Application, ICanvas } from "pixi.js";

import { Point, isVariable, indexOf } from "./types";
import { getVariableBounds, getVariableText } from "./variable";

export function useInput(
  app: Application<ICanvas> | undefined,
  editing: string,
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

    if (!isVariable(editing)) {
      return;
    }

    const index = indexOf(app?.stage.children, editing);
    const item = app?.stage.children[index];
    const bounds = getVariableBounds(item);
    console.log(bounds);
    setInputWidth(Math.max(300, bounds.width));
    setInputHeight(bounds.height);
    setInputValue(getVariableText(item));
    setInputPosition({ x: bounds.x, y: bounds.y });
    setInputVisible(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  return [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ];
}
