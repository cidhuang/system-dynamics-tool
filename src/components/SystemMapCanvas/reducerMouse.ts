import { Point } from "@/lib/types";

import { IStateCanvas, ESystemMapCanvasMode } from "./types";

import {
  StateReducers,
  reducers as reducerModeMoveShapeItem,
} from "./reducerMouseModeMoveShapeItem";

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
  [ESystemMapCanvasMode.MoveShapeItem]: reducerModeMoveShapeItem,
  /*
  [ESystemMapCanvasMode.AddVariable]: reducerModeAddVariable,
  [ESystemMapCanvasMode.AddStock]: reducerModeAddStock,
  [ESystemMapCanvasMode.AddLink]: reducerModeAddLink,
  [ESystemMapCanvasMode.AddFlow]: reducerModeAddFlow,
  */
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
