import { Point } from "@/components/SystemMapCanvas/lib/types";

import { IStateCanvas, ESystemMapCanvasMode, StateReducers } from "./types";

import { reducers as reducerModeView } from "./reducerMouseModeView";
import { reducers as reducerModeEdit } from "./reducerMouseModeEdit";
import { reducers as reducerModeAddLinkFlow } from "./reducerMouseModeAddLinkFlow";

const mouse = [
  "MouseLeftDown",
  "MouseLeftUp",
  "MouseLeftClick",
  "MouseMove",
  "MouseLeftDoubleClick",
] as const;
type Mouse = (typeof mouse)[number];
export const isMouse = (x: any): x is Mouse => mouse.includes(x);
export type ActionMouse = { type: Mouse; xy: Point; item: string };

const reducersMode: Record<number, StateReducers> = {
  [ESystemMapCanvasMode.View]: reducerModeView,
  [ESystemMapCanvasMode.Edit]: reducerModeEdit,
  [ESystemMapCanvasMode.AddLinkFlow]: reducerModeAddLinkFlow,
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
