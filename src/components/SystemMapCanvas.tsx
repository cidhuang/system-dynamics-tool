"use client"

import { Text, Point, Application, type ICanvas } from 'pixi.js';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Stage } from '@pixi/react'

import { Variable } from '@/lib/modals';
//import { ViewEdge } from './ViewEdge';
//import { useDrawingReducer, Edge, Node, isEdge, isNode, initDrawingState } from './drawingReducer';
//import { indexOf } from './Functions';
//import useUndoable from 'use-undoable';

interface SystemMapCanvasProps {
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
}

const SystemMapCanvas = ({
  variables,
}: SystemMapCanvasProps) => {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [offset, setOffset] = useState<Point>();

  useEffect(() => {
    if (app === undefined) {
      return;
    }

    setOffset(new Point(
      (app?.view as unknown as HTMLElement).offsetLeft ?? 0,
      (app?.view as unknown as HTMLElement).offsetTop ?? 0,
    ));

  }, [app?.view]);

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
      options={{ backgroundColor: 0xeef1f5, antialias: true, backgroundAlpha: 1 }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
    </Stage>
  );
};

export default SystemMapCanvas;
