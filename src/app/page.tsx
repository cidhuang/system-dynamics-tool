"use client";

import { useRef, Suspense, useState } from "react";

import { useMenu } from "./lib/useMenu";
import { useMode } from "./lib/useMode";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import {
  SystemMapCanvas,
  SystemMapCanvasRef,
} from "@/components/SystemMapCanvas/SystemMapCanvas";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { Radio } from "@/components/Radio/Radio";

import {
  Variable,
  Link,
  Stock,
  Flow,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";
import { IStateCanvasModes } from "@/components/SystemMapCanvas/reducer/types";
import {
  ESystemMapCanvasModeDragFromVariableStock,
  ESystemMapCanvasModeDoubleClickOnLink,
} from "@/components/SystemMapCanvas/reducer/types";

function HomeImp() {
  const canvasRef = useRef<SystemMapCanvasRef>(null);

  const [items0, setItems0] = useState<IItems>({
    variables: new Array<Variable>(),
    links: new Array<Link>(),
    stocks: new Array<Stock>(),
    flows: new Array<Flow>(),
  });

  const [items, setItems] = useState<IItems>({
    variables: new Array<Variable>(),
    links: new Array<Link>(),
    stocks: new Array<Stock>(),
    flows: new Array<Flow>(),
  });

  const [canvasModes, setCanvasModes] = useState<IStateCanvasModes>({
    dragFromVariableStock:
      ESystemMapCanvasModeDragFromVariableStock.MoveVariableStock,
    doubleClickOnLink: ESystemMapCanvasModeDoubleClickOnLink.ToggleRelation,
    doubleClickToDeleteItem: false,
  });

  const [handlerCanUndoChanged, handlerCanRedoChanged, menus] = useMenu(
    canvasRef,
    setItems0,
    items,
  );

  const [
    lableDeleteItem,
    handleDeleteItem,
    labelDragFromVariableStock,
    modesDragFromVariableStock,
    labelDoubleClickOnLink,
    modesDoubleClickOnLink,
  ] = useMode(canvasRef, canvasModes);

  function handleModesChange(modes: IStateCanvasModes) {
    setCanvasModes(modes);
  }

  function handleItemsChange(items: IItems): void {
    setItems(items);
  }

  return (
    <>
      <Suspense>
        <MenuBar menus={menus} />
        <div className="flex">
          <Checkbox
            label={lableDeleteItem}
            checked={canvasModes.doubleClickToDeleteItem === true}
            onChange={handleDeleteItem}
          />
          <div className="flex border">
            <label className="m-4">{labelDragFromVariableStock + ": "}</label>
            {modesDragFromVariableStock.map((item, i) => {
              return (
                <Radio
                  key={"mode-" + i}
                  label={item.label}
                  value={item.mode}
                  checked={canvasModes.dragFromVariableStock === item.mode}
                  onClick={() => item.handler(item.mode)}
                />
              );
            })}
          </div>
          <div className="flex border">
            <label className="m-4">{labelDoubleClickOnLink + ": "}</label>
            {modesDoubleClickOnLink.map((item, i) => {
              return (
                <Radio
                  key={"mode-" + i}
                  label={item.label}
                  value={item.mode}
                  checked={canvasModes.doubleClickOnLink === item.mode}
                  onClick={() => item.handler(item.mode)}
                />
              );
            })}
          </div>
        </div>
      </Suspense>
      <SystemMapCanvas
        ref={canvasRef}
        modes={canvasModes}
        onModesChange={handleModesChange}
        onCanUndoChanged={handlerCanUndoChanged}
        onCanRedoChanged={handlerCanRedoChanged}
        items={items0}
        onItemsChange={handleItemsChange}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeImp />
    </Suspense>
  );
}
