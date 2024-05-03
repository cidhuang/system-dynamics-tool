import { Point } from "@/components/SystemMapCanvas/lib/types";
import {
  IStateCanvas,
  EStateCanvas,
  MouseReducers,
  StateReducers,
} from "./types";
import {
  reducerMovingCanvasMove,
  reducerMovingCanvasUp,
  reducerShapingLinkMove,
  reducerShapingLinkUp,
  reducerShapingFlowMove,
  reducerShapingFlowUp,
} from "./reducerMouseCommon";

function reducerIdleDown(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    return {
      ...state,
      state: EStateCanvas.MovingCanvas,
      xy0: xy,
    };
  }

  return state;
}

function reducerIdleClick(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    return {
      ...state,
      state: EStateCanvas.MovingCanvas,
      xy0: xy,
    };
  }

  return state;
}

function reducerIdleDoubleClick(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    return {
      ...state,
      state: EStateCanvas.MovingCanvas,
      xy0: xy,
    };
  }

  return state;
}

const reducersIdle: MouseReducers = {
  MouseLeftDown: reducerIdleDown,
  MouseClick: reducerIdleClick,
  MouseLeftDoubleClick: reducerIdleDoubleClick,
};

const reducersMovingCanvas: MouseReducers = {
  MouseMove: reducerMovingCanvasMove,
  MouseLeftUp: reducerMovingCanvasUp,
};

export function reducerMovingVariableMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

export function reducerMovingVariableUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersMovingVariable: MouseReducers = {
  MouseMove: reducerMovingVariableMove,
  MouseLeftUp: reducerMovingVariableUp,
};

export function reducerMovingStockMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

export function reducerMovingStockUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

const reducersMovingStock: MouseReducers = {
  MouseMove: reducerMovingStockMove,
  MouseLeftUp: reducerMovingStockUp,
};

const reducersShapingLink: MouseReducers = {
  MouseMove: reducerShapingLinkMove,
  MouseLeftUp: reducerShapingLinkUp,
};

const reducersShapingFlow: MouseReducers = {
  MouseMove: reducerShapingFlowMove,
  MouseLeftUp: reducerShapingFlowUp,
};

export const reducers: StateReducers = {
  [EStateCanvas.Idle]: reducersIdle,
  [EStateCanvas.MovingCanvas]: reducersMovingCanvas,
  [EStateCanvas.MovingVariable]: reducersMovingVariable,
  [EStateCanvas.MovingStock]: reducersMovingStock,
  [EStateCanvas.ShapingLink]: reducersShapingLink,
  [EStateCanvas.ShapingFlow]: reducersShapingFlow,
};
