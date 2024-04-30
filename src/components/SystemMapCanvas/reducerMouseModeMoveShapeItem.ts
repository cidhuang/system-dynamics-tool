import { Point } from "@/lib/types";
import { IStateCanvas, EStateCanvas } from "./types";
import {
  reducerMovingCanvasMove,
  reducerMovingCanvasUp,
} from "./reducerMouseCommon";

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;

function reducerIdleDown(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    return {
      ...state,
      state: EStateCanvas.MovingCanvas,
      xy0: xy,
    };
  }

  return {
    ...state,
  };
}

const reducersIdle: MouseReducers = {
  MouseLeftDown: reducerIdleDown,
};

const reducersMovingCanvas: MouseReducers = {
  MouseMove: reducerMovingCanvasMove,
  MouseLeftUp: reducerMovingCanvasUp,
};

export const reducers: StateReducers = {
  [EStateCanvas.Idle]: reducersIdle,
  [EStateCanvas.MovingCanvas]: reducersMovingCanvas,
};
