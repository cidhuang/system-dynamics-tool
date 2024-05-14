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

import { InputTextArea } from "./InputTextArea";
import { useInput } from "./lib/useInput";
import { useView } from "./lib/useView";

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
  const ref = useRef(null);

  const [selected, setSelected] = useState<string>("");
  const [editing, setEditing] = useState<string>("");
  const [moving, setMoving] = useState<boolean>(false);
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

  const [
    app,
    setApp,
    handleZoomIn,
    handleZoomOut,
    XY,
    startMovingViewport,
    moveViewport,
  ] = useCanvas(ref, editing);

  const [itemName] = useView(app, state);

  const [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ] = useInput(app, editing);

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
