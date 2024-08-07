import { IItems } from "@/components/SystemMapCanvas/lib/types";
import { Point } from "../lib/geometry";

export enum ESystemMapCanvasModeDragFromVariableStock {
  MoveVariableStock,
  AddLinkFlow,
}

export enum ESystemMapCanvasModeDoubleClickOnLink {
  ToggleRelation,
  ToggleDirection,
  ToggleTimeDelay,
}

export enum ESystemMapCanvasModeDoubleClickOnBackground {
  CreateVariable,
  CreateStock,
}

export enum EStateCanvas {
  Idle,
  MovingVariable,
  MovingStock,
  ShapingLink,
  ShapingFlow,
  DragginNewLinkFlow,
}

export interface IStateCanvasModes {
  dragFromVariableStock: ESystemMapCanvasModeDragFromVariableStock;
  doubleClickOnLink: ESystemMapCanvasModeDoubleClickOnLink;
  doubleClickToDeleteItem: boolean;
  doubleClickOnBackground: ESystemMapCanvasModeDoubleClickOnBackground;
}

export interface IStateCanvas {
  modes: IStateCanvasModes;
  state: EStateCanvas;
  items: IItems;
  cmdUndoSetItems: number;
  cmdUndoResetItems: number;
  dragStart?: string;
  dragLinkEnd?: string | Point;
  dragLinkMid?: Point;
}

export type MouseReducers = Record<
  string,
  (state: IStateCanvas, xy: Point, item: string) => IStateCanvas
>;

export type StateReducers = Record<number, MouseReducers>;
