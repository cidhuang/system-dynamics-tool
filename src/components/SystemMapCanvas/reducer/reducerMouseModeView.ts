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
} from "./reducerMouseCommon";

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
