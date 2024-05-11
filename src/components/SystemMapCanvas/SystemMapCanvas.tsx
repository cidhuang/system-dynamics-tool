"use client";

import { useState, useEffect, useReducer, type SyntheticEvent } from "react";
import { Stage } from "@pixi/react";
//import useUndoable from 'use-undoable';

import {
  Point,
  isVariable,
  indexOf,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, ESystemMapCanvasMode } from "./reducer/types";
import { useApp } from "./lib/useApp";
import { addViewVariable, updateViewVariable } from "./lib/variable";

interface SystemMapCanvasProps {
  mode: ESystemMapCanvasMode;
  zoomIn: number;
  zoomOut: number;
  items: IItems;
  onItemsChange: (items: IItems) => void;
}

export const SystemMapCanvas = ({
  mode,
  zoomIn,
  zoomOut,
  items,
  onItemsChange,
}: SystemMapCanvasProps) => {
  const [app, setApp, offset, scale, handleZoomIn, handleZoomOut] = useApp();

  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [isMovingCanvas, setIsMovingCanvas] = useState<boolean>(false);
  const [xy0, setXY0] = useState<Point>({ x: 0, y: 0 });

  const [state, dispatch] = useReducer(reducer, {
    mode: mode,
    state: EStateCanvas.Idle,
    dragStart: "",
    items: items,
  });

  const x = (x: number): number => {
    const left = offset?.x ?? 0;
    return (
      (x - left + document.documentElement.scrollLeft - position.x) / scale.x
    );
  };

  const y = (y: number): number => {
    const top = offset?.y ?? 0;
    return (
      (y - top + document.documentElement.scrollTop - position.y) / scale.y
    );
  };

  useEffect(() => {
    dispatch({ type: "Mode", mode: mode });
  }, [mode]);

  useEffect(() => {
    handleZoomIn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomIn]);

  useEffect(() => {
    handleZoomOut();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOut]);

  useEffect(() => {
    onItemsChange(state.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items]);

  useEffect(() => {
    if (app === undefined) {
      return;
    }

    for (let i = 0; i < state.items.variables.length; i++) {
      const variable = state.items.variables[i];
      if (!updateViewVariable(app.stage, variable)) {
        addViewVariable(app.stage, variable);
      }
    }

    for (let i = app?.stage.children.length - 1; i >= 0; i--) {
      const name = app?.stage.children[i].name ?? "";

      //if (isEdge(name) && indexOf(mouseState.edges, name) < 0) {
      //  app?.stage.removeChildAt(i);
      //}

      if (isVariable(name) && indexOf(state.items.variables, name) < 0) {
        app?.stage.removeChildAt(i);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items.variables]);

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    const item = "";
    if (item === "") {
      setIsMovingCanvas(true);
      setXY0({ x: X, y: Y });
      return;
    }

    if (e.button === 0) {
      dispatch({ type: "MouseLeftDown", xy: { x: X, y: Y }, item: item });
    }
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);
    //const name = hover(X, Y);

    if (isMovingCanvas) {
      const position1 = {
        x: position.x + (X - xy0.x) * scale.x,
        y: position.y + (Y - xy0.y) * scale.y,
      };
      app?.stage.position.set(position1.x, position1.y);

      return;
    }

    dispatch({ type: "MouseMove", xy: { x: X, y: Y }, item: "" });
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    //console.log(e);

    const X = x(e.clientX);
    const Y = y(e.clientY);

    if (isMovingCanvas) {
      setIsMovingCanvas(false);
      setPosition({
        x: app?.stage.position.x ?? 0,
        y: app?.stage.position.y ?? 0,
      });
      return;
    }

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

    //dispatch({ type: "MouseLeftClick", xy: { x: X, y: Y }, item: "" });
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
