"use client";

import { useState, useEffect, useReducer, useRef } from "react";
import { Stage } from "@pixi/react";
import useUndo from "use-undo";

import { IItems, isVariable } from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, ESystemMapCanvasMode } from "./reducer/types";
import { useMouse } from "./hooks/useMouse";

import { InputTextArea } from "./InputTextArea";
import { useInput } from "./hooks/useInput";
import { useView } from "./hooks/useView";

interface SystemMapCanvasProps {
  mode: ESystemMapCanvasMode;
  toggleLinkDirection: boolean;
  deleteItem: boolean;
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
  toggleLinkDirection,
  deleteItem,
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
  const [editingText, setEditingText] = useState<string>("");

  const [state, dispatch] = useReducer(reducer, {
    mode: mode,
    state: EStateCanvas.Idle,
    items: items,
    cmdUndoAdd: 0,
    cmdUndoReset: 0,
    toggleLinkDirection: toggleLinkDirection,
    deleteItem: deleteItem,
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
  ] = useMouse(
    app,
    ref,
    selected,
    setSelected,
    editingText,
    dispatch,
    itemName,
    handleEdit,
  );

  const [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ] = useInput(app, editingText, setEditingText);

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
    dispatch({ type: "ToggleLinkDirection", enabled: toggleLinkDirection });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleLinkDirection]);

  useEffect(() => {
    dispatch({ type: "DeleteItem", enabled: deleteItem });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteItem]);

  useEffect(() => {
    dispatch({ type: "NewMap", items: items });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    resetItems(state.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cmdUndoReset]);

  function handleEdit(item: string) {
    if (isVariable(item)) {
      setEditingText(item);
    }
  }

  function handleNameKeyEnterDown(value: string) {
    const item = structuredClone(
      state.items.variables.find((variable) => variable.name === editingText),
    );
    if (item === undefined) {
      return;
    }
    if (item.text !== value) {
      item.text = value;
      dispatch({ type: "ChangeItems", variables: [item] });
    }
    setEditingText("");
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
