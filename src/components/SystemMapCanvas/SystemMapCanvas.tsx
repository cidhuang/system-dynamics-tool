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

import { indexOf, IItems } from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, ESystemMapCanvasMode } from "./reducer/types";
import { useMouse } from "./hooks/useMouse";

import { InputTextArea } from "./InputTextArea";
import { useInput } from "./hooks/useInput";
import { useView } from "./hooks/useView";

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

  const [app, setApp, itemName] = useView(state);

  const [
    handleZoomIn,
    handleZoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    handleClick,
    handleContextMenu,
  ] = useMouse(app, ref, editing, dispatch, itemName, handleEdit);

  const [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ] = useInput(app, editing, setEditing);

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

  function handleEdit(item: string) {
    if (item === selected) {
      setEditing(item);
      return;
    }
    setSelected(item);
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
