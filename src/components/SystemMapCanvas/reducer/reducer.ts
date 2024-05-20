import { Variable, Link, Stock, Flow, IItems } from "../lib/types";
import { isMouse, ActionMouse, reducerMouse } from "./reducerMouse";
import { IStateCanvas, IStateCanvasModes, EStateCanvas } from "./types";

const modes = ["Modes"] as const;
type Modes = (typeof modes)[number];
const isModes = (x: any): x is Modes => modes.includes(x);
type ActionModes = { type: Modes; modes: IStateCanvasModes };

export function reducerModes(
  state: IStateCanvas,
  action: ActionModes,
): IStateCanvas {
  return {
    ...state,
    modes: action.modes,
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
    for (const item of action.variables) {
      const index = items.variables.findIndex((tmp) => tmp.name === item.name);
      items.variables[index] = item;
    }
  }
  if (action.links) {
    for (const item of action.links) {
      const index = items.links.findIndex((tmp) => tmp.name === item.name);
      items.links[index] = item;
    }
  }
  if (action.stocks) {
    for (const item of action.stocks) {
      const index = items.stocks.findIndex((tmp) => tmp.name === item.name);
      items.stocks[index] = item;
    }
  }
  if (action.flows) {
    for (const item of action.flows) {
      const index = items.flows.findIndex((tmp) => tmp.name === item.name);
      items.flows[index] = item;
    }
  }

  return {
    ...state,
    state: EStateCanvas.Idle,
    items: items,
    cmdUndoSetItems: state.cmdUndoSetItems + 1,
  };
}

const newMap = ["NewMap"] as const;
type NewMap = (typeof newMap)[number];
const isNewMap = (x: any): x is NewMap => newMap.includes(x);
type ActionNewMap = {
  type: NewMap;
  items: IItems;
};

export function reducerNewMap(
  state: IStateCanvas,
  action: ActionNewMap,
): IStateCanvas {
  return {
    ...state,
    state: EStateCanvas.Idle,
    items: action.items,
    cmdUndoResetItems: state.cmdUndoResetItems + 1,
  };
}

export type Actions =
  | ActionMouse
  | ActionModes
  | ActionUndoRedo
  | ActionChangeItems
  | ActionNewMap;

export function reducer(state: IStateCanvas, action: Actions): IStateCanvas {
  let r = state;
  if (isMouse(action.type)) {
    r = reducerMouse(state, action as ActionMouse);
  }

  if (isModes(action.type)) {
    r = reducerModes(state, action as ActionModes);
  }

  if (isUndoRedo(action.type)) {
    r = reducerUndoRedo(state, action as ActionUndoRedo);
  }

  if (isChangeItems(action.type)) {
    r = reducerChangeItems(state, action as ActionChangeItems);
  }

  if (isNewMap(action.type)) {
    r = reducerNewMap(state, action as ActionNewMap);
  }

  //console.log("reducer", r);

  return r;
}
