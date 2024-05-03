import { IStateCanvas, EStateCanvas } from "./types";
import { Point } from "@/components/SystemMapCanvas/lib/types";

export function reducerMovingCanvasMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    leftTop: {
      x: state.leftTop.x + xy.x - state.xy0.x,
      y: state.leftTop.y + xy.y - state.xy0.y,
    },
    xy0: xy,
  };
}

export function reducerMovingCanvasUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

export function reducerShapingLinkMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

export function reducerShapingLinkUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}

export function reducerShapingFlowMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return state;
}

export function reducerShapingFlowUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  return {
    ...state,
    state: EStateCanvas.Idle,
  };
}
