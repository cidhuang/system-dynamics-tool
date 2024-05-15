import { IItems } from "@/components/SystemMapCanvas/lib/types";
import { Point } from "../lib/geometry";

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
  items: IItems;
  cmdUndoAdd: number;
  dragStart?: string;
  dragLinkEnd?: string | Point;
  dragLinkMid?: Point;
}

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;
