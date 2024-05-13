import { Variable, Link, Stock, Flow, IItems, indexOf } from "../lib/types";
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

const changeItems = ["ChangeItems"] as const;
type ChangeItems = (typeof changeItems)[number];
const isChangeItems = (x: any): x is ChangeItems => changeItems.includes(x);
type ActionChangeItems = {
  type: ChangeItems;
  variables?: Variable[];
  links?: Link[];
  stocks?: Stock[];
  flows?: Flow[];
};

export function reducerChangeItems(
  state: IStateCanvas,
  action: ActionChangeItems,
): IStateCanvas {
  let items = structuredClone(state.items);
  if (action.variables) {
    for (let i = 0; i < action.variables.length; i++) {
      const item = action.variables[i];
      const index = indexOf(items.variables, item.name);
      items.variables[index] = item;
    }
  }
  if (action.links) {
    for (let i = 0; i < action.links.length; i++) {
      const item = action.links[i];
      const index = indexOf(items.links, item.name);
      items.links[index] = item;
    }
  }
  if (action.stocks) {
    for (let i = 0; i < action.stocks.length; i++) {
      const item = action.stocks[i];
      const index = indexOf(items.stocks, item.name);
      items.stocks[index] = item;
    }
  }
  if (action.flows) {
    for (let i = 0; i < action.flows.length; i++) {
      const item = action.flows[i];
      const index = indexOf(items.flows, item.name);
      items.flows[index] = item;
    }
  }

  return {
    ...state,
    state: EStateCanvas.Idle,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

export type Actions =
  | ActionMouse
  | ActionMode
  | ActionUndoRedo
  | ActionChangeItems;

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

  if (isChangeItems(action.type)) {
    r = reducerChangeItems(state, action as ActionChangeItems);
  }

  //console.log("reducer", r);

  return r;
}
