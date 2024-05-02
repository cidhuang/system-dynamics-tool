import { Point } from "@/lib/types";
import {
  IStateCanvas,
  EStateCanvas,
  MouseReducers,
  StateReducers,
} from "./types";

function reducerIdleDown(state: IStateCanvas, xy: Point, item: string) {
  /*
  if (item === "") {
    return {
      ...state,
      state: EStateCanvas.DraggingFlowFromSource,
      xy0: xy,
    };
  }
  */
  return {
    ...state,
  };
}

const reducersIdle: MouseReducers = {
  MouseLeftDown: reducerIdleDown,
};

export const reducers: StateReducers = {
  [EStateCanvas.Idle]: reducersIdle,
  //[EStateCanvas.DraggingFlowFromSource]:
};
