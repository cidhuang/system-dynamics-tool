"use client";

import { Application, Renderer } from "pixi.js";
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
  const [app, setApp] = useState<Application<Renderer<HTMLCanvasElement>>>();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    if (app.renderer === undefined || app.renderer === null) {
      return;
    }

    if (app.renderer.view === undefined || app.renderer.view === null) {
      return;
    }

    const view = app.renderer.view as unknown as HTMLElement;

    setOffset({ x: view.offsetLeft ?? 0, y: view.offsetTop ?? 0 });
  }, [app, app?.renderer?.view]);

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    console.log(e);
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    console.log(e);
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    console.log(e);
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    console.log(e);
  }

  function handleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    console.log(e);
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
