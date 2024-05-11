import { Point, IItems } from "@/components/SystemMapCanvas/lib/types";

export enum ESystemMapCanvasMode {
  MoveVariableStock,
  AddLinkFlow,
}

export enum EStateCanvas {
  Idle,
  MovingVariable,
  MovingStock,
  ShapingLink,
  ShapingFlow,
  DragginNewLinkFlow,
}

export interface IStateCanvas {
  mode: ESystemMapCanvasMode;
  state: EStateCanvas;
  dragStart: string;
  items: IItems;
  cmdUndoAdd: number;
}

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;
