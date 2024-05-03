import { Point, Variable } from "@/components/SystemMapCanvas/lib/types";

export enum ESystemMapCanvasMode {
  View,
  Edit,
  AddLinkFlow,
}

export enum EStateCanvas {
  Idle,
  MovingCanvas,
  MovingVariable,
  MovingStock,
  ShapingLink,
  ShapingFlow,
  DragginNewLinkFlow,
}

export interface IStateCanvas {
  mode: ESystemMapCanvasMode;
  state: EStateCanvas;
  leftTop: Point;
  xy0: Point;
  variables: Variable[];
}

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;
