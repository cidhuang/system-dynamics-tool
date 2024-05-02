import { Point } from "@/lib/types";

export enum ESystemMapCanvasMode {
  ReadOnly,
  MoveShapeItem,
  AddVariable,
  AddLink,
  AddStock,
  AddFlow,
}

export enum EStateCanvas {
  Idle,
  MovingCanvas,
  MovingVariable,
  MovingStock,
  ShapingLink,
  MovingValve,
  MovingSource,
  MovingSink,
  DragginLink,
  DraggingFlowFromSource,
  DraggingFlowFromStock,
}

export interface IStateCanvas {
  mode: ESystemMapCanvasMode;
  state: EStateCanvas;
  leftTop: Point;
  xy0: Point;
}

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;

// Actions
/*
export type MouseLeftDown = { type: "MouseLeftDown"; xy: Point; item: string };
export type MouseLeftUp = { type: "MouseLeftUp"; xy: Point; item: string };
export type MouseLeftClick = {
  type: "MouseLeftClick";
  xy: Point;
  item: string;
};
export type MouseMove = { type: "MouseMove"; xy: Point; item: string };

export type MouseActions =
  | MouseLeftDown
  | MouseLeftUp
  | MouseLeftClick
  | MouseMove;
*/
