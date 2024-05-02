import { Point } from "@/lib/types";

import { IStateCanvas, ESystemMapCanvasMode, StateReducers } from "./types";

import { reducers as reducerModeReadOnly } from "./reducerMouseModeReadOnly";
import { reducers as reducerModeMoveShapeItem } from "./reducerMouseModeMoveShapeItem";
import { reducers as reducerModeAddVariable } from "./reducerMouseModeAddVariable";
import { reducers as reducerModeAddLink } from "./reducerMouseModeAddLink";
import { reducers as reducerModeAddStock } from "./reducerMouseModeAddStock";
import { reducers as reducerModeAddFlow } from "./reducerMouseModeAddFlow";

const mouse = [
  "MouseLeftDown",
  "MouseLeftUp",
  "MouseLeftClick",
  "MouseMove",
] as const;
type Mouse = (typeof mouse)[number];
export const isMouse = (x: any): x is Mouse => mouse.includes(x);
export type ActionMouse = { type: Mouse; xy: Point; item: string };

const reducersMode: Record<number, StateReducers> = {
  [ESystemMapCanvasMode.ReadOnly]: reducerModeReadOnly,
  [ESystemMapCanvasMode.MoveShapeItem]: reducerModeMoveShapeItem,
  [ESystemMapCanvasMode.AddVariable]: reducerModeAddVariable,
  [ESystemMapCanvasMode.AddStock]: reducerModeAddStock,
  [ESystemMapCanvasMode.AddLink]: reducerModeAddLink,
  [ESystemMapCanvasMode.AddFlow]: reducerModeAddFlow,
};

// Reducer
export function reducerMouse(
  state: IStateCanvas,
  action: ActionMouse,
): IStateCanvas {
  const reducer = reducersMode[state.mode][state.state][action.type];
  if (reducer === undefined) {
    return state;
  }

  const r = reducer(state, action.xy, action.item);

  //console.log(r);

  return r;
}
