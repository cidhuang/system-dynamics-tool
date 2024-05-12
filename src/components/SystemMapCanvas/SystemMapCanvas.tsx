"use client";

import { useState, useEffect, useReducer, type SyntheticEvent } from "react";
import { Stage } from "@pixi/react";
import useUndo from "use-undo";

import {
  Point,
  isVariable,
  isLink,
  indexOf,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, ESystemMapCanvasMode } from "./reducer/types";
import { useCanvas } from "./lib/useCanvas";
import {
  addViewVariable,
  updateViewVariable,
  nameVariable,
} from "./lib/variable";
import { addViewLink, updateViewLink } from "./lib/link";

interface SystemMapCanvasProps {
  mode: ESystemMapCanvasMode;
  cmdZoomIn: number;
  cmdZoomOut: number;
  cmdUndo: number;
  cmdRedo: number;
  onCanUndoChanged: (canUndo: boolean) => void;
  onCanRedoChanged: (canRedo: boolean) => void;
  items: IItems;
  onItemsChange: (items: IItems) => void;
}

export const SystemMapCanvas = ({
  mode,
  cmdZoomIn,
  cmdZoomOut,
  cmdUndo,
  cmdRedo,
  onCanUndoChanged,
  onCanRedoChanged,
  items,
  onItemsChange,
}: SystemMapCanvasProps) => {
  const [
    app,
    setApp,
    handleZoomIn,
    handleZoomOut,
    XY,
    startMovingViewport,
    moveViewport,
  ] = useCanvas();

  const [isMovingViewport, setIsMovingViewport] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, {
    mode: mode,
    state: EStateCanvas.Idle,
    items: items,
    cmdUndoAdd: 0,
  });

  const [
    itemsState,
    {
      set: setItems,
      reset: resetItems,
      undo: undoItems,
      redo: redoItems,
      canUndo,
      canRedo,
    },
  ] = useUndo(items);
  const { present: presentItems } = itemsState;

  useEffect(() => {
    dispatch({ type: "Mode", mode: mode });
  }, [mode]);

  useEffect(() => {
    handleZoomIn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdZoomIn]);

  useEffect(() => {
    handleZoomOut();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdZoomOut]);

  useEffect(() => {
    undoItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdUndo]);

  useEffect(() => {
    redoItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdRedo]);

  useEffect(() => {
    onCanUndoChanged(canUndo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUndo]);

  useEffect(() => {
    onCanRedoChanged(canRedo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRedo]);

  useEffect(() => {
    dispatch({ type: "UndoRedo", items: presentItems });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentItems]);

  useEffect(() => {
    setItems(state.items);
    onItemsChange(state.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cmdUndoAdd]);

  useEffect(() => {
    if (app === undefined) {
      return;
    }

    for (let i = 0; i < state.items.links.length; i++) {
      const link = state.items.links[i];
      const start =
        state.items.variables[indexOf(state.items.variables, link.start)].xy;
      const end =
        state.items.variables[indexOf(state.items.variables, link.end)].xy;
      if (!updateViewLink(app.stage, link.name, start, end, link.mid)) {
        addViewLink(app.stage, link.name, start, end);
      }
    }

    for (let i = 0; i < state.items.variables.length; i++) {
      const variable = state.items.variables[i];
      if (!updateViewVariable(app.stage, variable)) {
        addViewVariable(app.stage, variable);
      }
    }

    for (let i = app?.stage.children.length - 1; i >= 0; i--) {
      const name = app?.stage.children[i].name ?? "";

      //if (isEdge(name) && indexOf(state.items.links, name) < 0) {
      //  app?.stage.removeChildAt(i);
      //}

      if (isLink(name) && indexOf(state.items.links, name) < 0) {
        app?.stage.removeChildAt(i);
      }

      if (isVariable(name) && indexOf(state.items.variables, name) < 0) {
        app?.stage.removeChildAt(i);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items]);

  //drag link
  useEffect(() => {
    if (app === undefined) {
      return;
    }

    let startPoint = undefined;
    if (state.dragStart !== undefined) {
      const index = indexOf(state.items.variables, state.dragStart);
      if (index >= 0) {
        startPoint = state.items.variables[index].xy;
      }
    }

    let endPoint = undefined;
    if (state.dragLinkEnd !== undefined) {
      if (typeof state.dragLinkEnd === "string") {
        const index = indexOf(state.items.variables, state.dragLinkEnd);
        if (index >= 0) {
          endPoint = state.items.variables[index].xy;
        }
      } else {
        endPoint = state.dragLinkEnd;
      }
    }
    /* 
    else if (
      mouseState.draggingX !== undefined &&
      mouseState.draggingY !== undefined
    ) {
      endPoint = new Point(mouseState.draggingX, mouseState.draggingY);
    }
    */

    const dragLink = indexOf(app?.stage.children, "dragLink");

    if (startPoint === undefined || endPoint === undefined) {
      if (dragLink >= 0) {
        app?.stage.removeChildAt(dragLink);
      }
      return;
    }

    if (dragLink >= 0) {
      updateViewLink(app?.stage, "dragLink", startPoint, endPoint);
      return;
    }

    if (state.dragStart === undefined) {
      return;
    }
    /*
    if (
      (mouseState.draggingX === undefined ||
        mouseState.draggingY === undefined) &&
      state.dragLinkEnd === undefined
    ) {
      return;
    }
    */
    //addViewDragging(startPoint, endPoint, "dragLink");
    addViewLink(app?.stage, "dragLink", startPoint, endPoint);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dragLinkEnd, state.dragLinkMid]);

  function itemName(xy: Point): string {
    if (app === undefined) {
      return "";
    }

    let name = "";
    name = nameVariable(app?.stage, state.items.variables, xy);
    if (name !== "") {
      return name;
    }

    return name;
  }

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas);

    if (item === "") {
      setIsMovingViewport(true);
      startMovingViewport(xyCanvas);
      return;
    }

    if (e.button === 0) {
      dispatch({ type: "MouseLeftDown", xy: xyMap, item: item });
    }
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas);

    if (isMovingViewport) {
      moveViewport(xyCanvas);
      return;
    }

    dispatch({ type: "MouseMove", xy: xyMap, item: item });
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas);

    if (isMovingViewport) {
      setIsMovingViewport(false);
      return;
    }

    dispatch({ type: "MouseLeftUp", xy: xyMap, item: item });
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas);

    dispatch({
      type: "MouseLeftDoubleClick",
      xy: xyMap,
      item: item,
    });
  }

  function handleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas);

    //dispatch({ type: "MouseLeftClick", xy: xyMap, item: "" });
  }

  function handleContextMenu(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
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
