import { isMouse, ActionMouse, reducerMouse } from "./reducerMouse";
import { isMode, ActionMode, reducerMode } from "./reducerMode";
import { IStateCanvas } from "./types";

export type Actions = ActionMouse | ActionMode;

export function reducer(state: IStateCanvas, action: Actions): IStateCanvas {
  let r = state;
  if (isMouse(action.type)) {
    r = reducerMouse(state, action as ActionMouse);
  }

  if (isMode(action.type)) {
    r = reducerMode(state, action as ActionMode);
  }

  //console.log("reducer", r);

  return r;
}
