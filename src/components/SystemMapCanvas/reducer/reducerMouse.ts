import { Point, createVariable } from "@/components/SystemMapCanvas/lib/types";

import {
  EStateCanvas,
  IStateCanvas,
  MouseReducers,
  StateReducers,
} from "./types";

const mouse = [
  "MouseLeftDown",
  "MouseLeftUp",
  "MouseMove",
  "MouseLeftDoubleClick",
] as const;
type Mouse = (typeof mouse)[number];
export const isMouse = (x: any): x is Mouse => mouse.includes(x);
export type ActionMouse = { type: Mouse; xy: Point; item: string };

function reducerIdleDown(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    return {
      ...state,
      //state: EStateCanvas.MovingCanvas,
      xy0: xy,
    };
  }

  return state;
}

function reducerIdleDoubleClick(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    let variables = state.variables.slice();
    const name = createVariable(variables, xy);
    return {
      ...state,
      variables: variables,
    };
  }

  //if(isVariable(item) || isStock(item)) {
  //  return toggleVariableStock(state, item);
  //}

  return state;
}

const reducersIdle: MouseReducers = {
  MouseLeftDown: reducerIdleDown,
  MouseLeftDoubleClick: reducerIdleDoubleClick,
};

function reducerMovingVariableMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

function reducerMovingVariableUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersMovingVariable: MouseReducers = {
  MouseMove: reducerMovingVariableMove,
  MouseLeftUp: reducerMovingVariableUp,
};

function reducerMovingStockMove(state: IStateCanvas, xy: Point, item: string) {
  return state;
}

function reducerMovingStockUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersMovingStock: MouseReducers = {
  MouseMove: reducerMovingStockMove,
  MouseLeftUp: reducerMovingStockUp,
};

function reducerShapingLinkMove(state: IStateCanvas, xy: Point, item: string) {
  return state;
}

function reducerShapingLinkUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersShapingLink: MouseReducers = {
  MouseMove: reducerShapingLinkMove,
  MouseLeftUp: reducerShapingLinkUp,
};

function reducerShapingFlowMove(state: IStateCanvas, xy: Point, item: string) {
  return state;
}

function reducerShapingFlowUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersShapingFlow: MouseReducers = {
  MouseMove: reducerShapingFlowMove,
  MouseLeftUp: reducerShapingFlowUp,
};

function reducerDragginNewLinkFlowMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

function reducerDragginNewLinkFlowUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersDragginNewLinkFlow: MouseReducers = {
  MouseMove: reducerDragginNewLinkFlowMove,
  MouseLeftUp: reducerDragginNewLinkFlowUp,
};

const reducers: StateReducers = {
  [EStateCanvas.Idle]: reducersIdle,
  [EStateCanvas.MovingVariable]: reducersMovingVariable,
  [EStateCanvas.MovingStock]: reducersMovingStock,
  [EStateCanvas.ShapingLink]: reducersShapingLink,
  [EStateCanvas.ShapingFlow]: reducersShapingFlow,
  [EStateCanvas.DragginNewLinkFlow]: reducersDragginNewLinkFlow,
};

// Reducer
export function reducerMouse(
  state: IStateCanvas,
  action: ActionMouse,
): IStateCanvas {
  const reducer = reducers[state.state][action.type];
  if (reducer === undefined) {
    return state;
  }

  const r = reducer(state, action.xy, action.item);

  //console.log(r);

  return r;
}
