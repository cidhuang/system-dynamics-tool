import { Variable, Link, Stock, Flow, IItems } from "../lib/types";
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

const toggleLinkDirection = ["ToggleLinkDirection"] as const;
type ToggleLinkDirection = (typeof toggleLinkDirection)[number];
const isToggleLinkDirection = (x: any): x is ToggleLinkDirection =>
  toggleLinkDirection.includes(x);
type ActionToggleLinkDirection = {
  type: ToggleLinkDirection;
  enabled: boolean;
};

export function reducerToggleLinkDirection(
  state: IStateCanvas,
  action: ActionToggleLinkDirection,
): IStateCanvas {
  return {
    ...state,
    toggleLinkDirection: action.enabled,
    state: EStateCanvas.Idle,
  };
}

const deleteItem = ["DeleteItem"] as const;
type DeleteItem = (typeof deleteItem)[number];
const isDeleteItem = (x: any): x is DeleteItem => deleteItem.includes(x);
type ActionDeleteItem = { type: DeleteItem; enabled: boolean };

export function reducerDeleteItem(
  state: IStateCanvas,
  action: ActionDeleteItem,
): IStateCanvas {
  return {
    ...state,
    deleteItem: action.enabled,
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
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

export type Actions =
  | ActionMouse
  | ActionMode
  | ActionUndoRedo
  | ActionChangeItems
  | ActionToggleLinkDirection
  | ActionDeleteItem;

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

  if (isToggleLinkDirection(action.type)) {
    r = reducerToggleLinkDirection(state, action as ActionToggleLinkDirection);
  }

  if (isDeleteItem(action.type)) {
    r = reducerDeleteItem(state, action as ActionDeleteItem);
  }

  //console.log("reducer", r);

  return r;
}
