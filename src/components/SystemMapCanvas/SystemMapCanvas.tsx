"use client";

import { Text, Application, type ICanvas } from "pixi.js";
import { useEffect, useState, type SyntheticEvent } from "react";
import { Stage } from "@pixi/react";

import { Point, Variable } from "@/lib/types";
//import { ViewEdge } from './ViewEdge';
//import { useDrawingReducer, Edge, Node, isEdge, isNode, initDrawingState } from './drawingReducer';
//import { indexOf } from './Functions';
//import useUndoable from 'use-undoable';

import { ESystemMapCanvasMode } from "./SystemMapCanvasMode";

interface SystemMapCanvasProps {
  mode: ESystemMapCanvasMode;
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
}

export const SystemMapCanvas = ({ mode, variables }: SystemMapCanvasProps) => {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    const view = app.view as unknown as HTMLElement;

    setOffset({ x: view.offsetLeft ?? 0, y: view.offsetTop ?? 0 });
  }, [app?.view]);

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    if (app) {
      //app?.stage.scale.set(2,3);
      app?.stage.position.set(50, 50);
    }
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);
  }

  function handleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);
  }

  function handleContextMenu(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.preventDefault();
  }

  return (
    <Stage
      width={800}
      height={600}
      onMount={setApp as any}
      options={{
        backgroundColor: 0xeef1f5,
        antialias: true,
        backgroundAlpha: 1,
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    ></Stage>
  );
};
