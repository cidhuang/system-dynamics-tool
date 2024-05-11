import { IItems } from "../lib/types";
import { isMouse, ActionMouse, reducerMouse } from "./reducerMouse";
import { IStateCanvas, ESystemMapCanvasMode, EStateCanvas } from "./types";

const mode = ["Mode"] as const;
type Mode = (typeof mode)[number];
const isMode = (x: any): x is Mode => mode.includes(x);
type ActionMode = { type: Mode; mode: ESystemMapCanvasMode };

export function reducerMode(
  state: IStateCanvas,
  action: ActionMode,
): IStateCanvas {
  return {
    ...state,
    mode: action.mode,
    state: EStateCanvas.Idle,
  };
}

const undoRedo = ["UndoRedo"] as const;
type UndoRedo = (typeof undoRedo)[number];
const isUndoRedo = (x: any): x is UndoRedo => undoRedo.includes(x);
type ActionUndoRedo = {
  type: UndoRedo;
  items: IItems;
};

export function reducerUndoRedo(
  state: IStateCanvas,
  action: ActionUndoRedo,
): IStateCanvas {
  return {
    ...state,
    state: EStateCanvas.Idle,
    items: action.items,
  };
}

export type Actions = ActionMouse | ActionMode | ActionUndoRedo;

export function reducer(state: IStateCanvas, action: Actions): IStateCanvas {
  let r = state;
  if (isMouse(action.type)) {
    r = reducerMouse(state, action as ActionMouse);
  }

  if (isMode(action.type)) {
    r = reducerMode(state, action as ActionMode);
  }

  if (isUndoRedo(action.type)) {
    r = reducerUndoRedo(state, action as ActionUndoRedo);
  }

  //console.log("reducer", r);

  return r;
}
