"use client";

import { Text, Application, type ICanvas } from "pixi.js";
import { useEffect, useState, type SyntheticEvent } from "react";
import { Stage } from "@pixi/react";

import { Point, Variable } from "@/lib/types";
//import { ViewEdge } from './ViewEdge';
import { reducer } from "./reducer";
//import { indexOf } from './Functions';
//import useUndoable from 'use-undoable';
import { useReducer } from "react";

import { EStateCanvas, ESystemMapCanvasMode } from "./types";

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
}: SystemMapCanvasProps) => {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [state, dispatch] = useReducer(reducer, {
    mode: mode,
    state: EStateCanvas.Idle,
    leftTop: { x: 0, y: 0 },
    xy0: { x: 0, y: 0 },
  });

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    const view = app.view as unknown as HTMLElement;
    if (view === undefined || view === null) {
      return;
    }
    view.addEventListener("wheel", handleWheel);

    return () => {
      view.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    const view = app.view as unknown as HTMLElement;

    setOffset({ x: view.offsetLeft ?? 0, y: view.offsetTop ?? 0 });

    let text = new Text("Test");
    text.name = "test";
    text.style.align = "center";
    text.style.fill = "black";
    text.x = 100 - text.width / 2;
    text.y = 100 - text.height / 2;
    text.style.fill = "red";
    text.style.fontWeight = "normal";

    app.stage.addChild(text);
  }, [app?.view]);

  useEffect(() => {
    dispatch({ type: "Mode", mode: mode });
  }, [mode]);

  function handleZoomIn() {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
  }

  function handleZoomOut() {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  }

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
    app?.stage.scale.set(scale.x, scale.y);
  }, [scale]);

  function x(x: number) {
    const left = offset?.x ?? 0;
    return x - left + document.documentElement.scrollLeft;
  }

  function y(y: number) {
    const top = offset?.y ?? 0;
    return y - top + document.documentElement.scrollTop;
  }

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    switch (e.button) {
      case 0:
        dispatch({ type: "MouseLeftDown", xy: { x: X, y: Y }, item: "" });
        break;
      case 2:
        //dispatch({ type: 'MouseRightDown', x: X, y: Y, hover: name });
        break;
      default:
        break;
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

    switch (e.button) {
      case 0:
        dispatch({ type: "MouseLeftUp", xy: { x: X, y: Y }, item: "" });
        break;
      case 2:
        //dispatch({ type: 'MouseRightDown', x: X, y: Y, hover: name });
        break;
      default:
        break;
    }
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);
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

  function handleWheel(event: WheelEvent) {
    const e = event as unknown as WheelEvent;
    e.preventDefault();

    if (e.deltaY < 0) {
      handleZoomIn();
    }

    if (e.deltaY > 0) {
      handleZoomOut();
    }
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
