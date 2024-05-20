"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useReducer,
  useRef,
  useImperativeHandle,
} from "react";
import { Stage } from "@pixi/react";
import useUndo from "use-undo";

import { IItems, isVariable } from "@/components/SystemMapCanvas/lib/types";
import { reducer } from "./reducer/reducer";
import { EStateCanvas, IStateCanvasModes } from "./reducer/types";
import { useInteraction } from "./hooks/useInteraction";

import { InputTextArea } from "./InputTextArea";
import { useInput } from "./hooks/useInput";
import { useView } from "./hooks/useView";

export type SystemMapCanvasRef = {
  zoomIn: () => void;
  zoomOut: () => void;
  undo: () => void;
  redo: () => void;
  setModes: (modes: IStateCanvasModes) => void;
} | null;

interface SystemMapCanvasProps {
  modes: IStateCanvasModes;
  onModesChange: (modes: IStateCanvasModes) => void;
  onCanUndoChanged: (canUndo: boolean) => void;
  onCanRedoChanged: (canRedo: boolean) => void;
  items: IItems;
  onItemsChange: (items: IItems) => void;
}

export const SystemMapCanvas = forwardRef<
  SystemMapCanvasRef,
  SystemMapCanvasProps
>(function SystemMapCanvas(
  {
    modes,
    onModesChange,
    onCanUndoChanged,
    onCanRedoChanged,
    items,
    onItemsChange,
  }: SystemMapCanvasProps,
  ref,
) {
  const divRef = useRef(null);

  const [selected, setSelected] = useState<string>("");
  const [editingText, setEditingText] = useState<string>("");

  const [state, dispatch] = useReducer(reducer, {
    modes: modes,
    state: EStateCanvas.Idle,
    items: items,
    cmdUndoSetItems: 0,
    cmdUndoResetItems: 0,
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
    handleTouchStart,
    handleTouchMove,
    handleTouchUp,
  ] = useInteraction(
    app,
    divRef,
    selected,
    setSelected,
    editingText,
    dispatch,
    itemName,
    editTextStart,
    editTextEnd,
  );

  const [
    inputPosition,
    inputVisible,
    inputValue,
    inputWidth,
    inputHeight,
    setInputVisible,
  ] = useInput(app, editingText, setEditingText);

  useImperativeHandle(
    ref,
    () => {
      return {
        zoomIn() {
          handleZoomIn();
        },
        zoomOut() {
          handleZoomOut();
        },
        undo() {
          undoItems();
        },
        redo() {
          redoItems();
        },
        setModes(modes: IStateCanvasModes) {
          dispatch({ type: "Modes", modes: modes });
        },
      };
    },
    [handleZoomIn, handleZoomOut, undoItems, redoItems, state.modes],
  );

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
  }, [state.cmdUndoSetItems]);

  useEffect(() => {
    dispatch({ type: "NewMap", items: items });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    onModesChange(state.modes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.modes]);

  useEffect(() => {
    resetItems(state.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cmdUndoResetItems]);

  function editTextStart(item: string) {
    if (isVariable(item)) {
      setEditingText(item);
    }
  }

  function editTextEnd() {
    setEditingText("");
    setSelected("");
    setInputVisible(false);
  }

  function changeText(value: string) {
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
    <div ref={divRef} className="relative -z-10">
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchUp}
        ></Stage>
      </div>
      <InputTextArea
        visible={inputVisible}
        xy={inputPosition}
        width={inputWidth}
        height={inputHeight}
        value0={inputValue}
        onKeyEnterDown={changeText}
      />
    </div>
  );
});
