"use client";

import { useEffect, useReducer, type SyntheticEvent } from "react";
import { Stage } from "@pixi/react";
//import useUndoable from 'use-undoable';

import { Variable } from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, ESystemMapCanvasMode } from "./reducer/types";
import { useApp } from "./appHook";
//import { ViewEdge } from './ViewEdge';

interface SystemMapCanvasProps {
  mode: ESystemMapCanvasMode;
  zoomIn: number;
  zoomOut: number;
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
}

export const SystemMapCanvas = ({
  mode,
  zoomIn,
  zoomOut,
  variables,
  onVariablesChange,
}: SystemMapCanvasProps) => {
  const [app, setApp, handleZoomIn, handleZoomOut, x, y] = useApp();

  const [state, dispatch] = useReducer(reducer, {
    mode: mode,
    state: EStateCanvas.Idle,
    leftTop: { x: 0, y: 0 },
    xy0: { x: 0, y: 0 },
    variables: variables,
  });

  useEffect(() => {
    dispatch({ type: "Mode", mode: mode });
  }, [mode]);

  useEffect(() => {
    handleZoomIn();
  }, [zoomIn]);

  useEffect(() => {
    handleZoomOut();
  }, [zoomOut]);

  useEffect(() => {
    app?.stage.position.set(state.leftTop.x, state.leftTop.y);
  }, [state.leftTop]);

  useEffect(() => {
    onVariablesChange(state.variables);
  }, [state.variables]);

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    if (e.button === 0) {
      dispatch({ type: "MouseLeftDown", xy: { x: X, y: Y }, item: "" });
    }
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);
    //const name = hover(X, Y);

    dispatch({ type: "MouseMove", xy: { x: X, y: Y }, item: "" });
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    if (e.button === 0) {
      dispatch({ type: "MouseLeftUp", xy: { x: X, y: Y }, item: "" });
    }
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    dispatch({ type: "MouseLeftDoubleClick", xy: { x: X, y: Y }, item: "" });
  }

  function handleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    dispatch({ type: "MouseLeftClick", xy: { x: X, y: Y }, item: "" });
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
