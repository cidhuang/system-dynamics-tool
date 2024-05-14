"use client";

import {
  useState,
  useEffect,
  useReducer,
  useRef,
  type SyntheticEvent,
} from "react";
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
  isOnVariable,
} from "./lib/variable";
import { addViewLink, updateViewLink, isOnLink } from "./lib/link";

import { InputTextArea } from "./InputTextArea";
import { useInput } from "./lib/useInput";

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
  const [selected, setSelected] = useState<string>("");
  const [editing, setEditing] = useState<string>("");
  const [moving, setMoving] = useState<boolean>(false);

  const [
    app,
    setApp,
    handleZoomIn,
    handleZoomOut,
    XY,
    startMovingViewport,
    moveViewport,
  ] = useCanvas(offset, editing);

  const [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ] = useInput(app, editing);

  const ref = useRef(null);

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

      if (isLink(name) && indexOf(state.items.links, name) < 0) {
        app?.stage.removeChildAt(i);
      }

      if (isVariable(name) && indexOf(state.items.variables, name) < 0) {
        app?.stage.removeChildAt(i);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items]);

  // drag link
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

    addViewLink(app?.stage, "dragLink", startPoint, endPoint);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dragLinkEnd, state.dragLinkMid]);

  function itemName(xyCanvas: Point, xyMap: Point): string {
    if (app === undefined) {
      return "";
    }

    if (app?.stage === null) {
      return "";
    }

    for (let i = 0; i < app?.stage.children.length; i++) {
      const item = app?.stage.children[i];
      if (item.name === null) {
        continue;
      }

      if (isVariable(item.name)) {
        if (isOnVariable(item, xyCanvas)) {
          return item.name;
        }
      }

      if (isLink(item.name)) {
        if (isOnLink(item, xyMap)) {
          return item.name;
        }
      }
    }

    return "";
  }

  function offset(): Point {
    return {
      x: (ref.current as unknown as HTMLElement).offsetLeft,
      y: (ref.current as unknown as HTMLElement).offsetTop,
    };
  }

  function handleMouseDown(event: SyntheticEvent) {
    setMoving(false);
    if (editing !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

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
    setMoving(true);
    if (editing !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      moveViewport(xyCanvas);
      return;
    }

    dispatch({ type: "MouseMove", xy: xyMap, item: item });
  }

  function handleMouseUp(event: SyntheticEvent) {
    if (editing !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      setIsMovingViewport(false);
      return;
    }

    dispatch({ type: "MouseLeftUp", xy: xyMap, item: item });
  }

  function handleDoubleClick(event: SyntheticEvent) {
    if (editing !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    dispatch({
      type: "MouseLeftDoubleClick",
      xy: xyMap,
      item: item,
    });
  }

  function handleClick(event: SyntheticEvent) {
    if (moving) {
      return;
    }
    if (editing !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (item === selected) {
      setEditing(item);
      return;
    }
    setSelected(item);

    //dispatch({ type: "MouseLeftClick", xy: xyMap, item: "" });
  }

  function handleContextMenu(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    e.preventDefault();
  }

  function handleNameKeyEnterDown(value: string) {
    const index = indexOf(state.items.variables, editing);
    const item = structuredClone(state.items.variables[index]);
    if (item.text !== value) {
      item.text = value;
      dispatch({ type: "ChangeItems", variables: [item] });
    }
    setEditing("");
    setSelected("");
    setInputVisible(false);
  }

  return (
    <div ref={ref} className="relative -z-10">
      <div className="absolute left-0 top-0">
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
      </div>
      <InputTextArea
        visible={inputVisible}
        xy={inputPosition}
        width={inputWidth}
        height={inputHeight}
        value0={inputValue}
        onKeyEnterDown={handleNameKeyEnterDown}
      />
    </div>
  );
};
