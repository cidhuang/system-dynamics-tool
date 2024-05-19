"use client";

import { Suspense, useState } from "react";

import { useMenu } from "./lib/useMenu";
import { useMode } from "./lib/useMode";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { Radio } from "@/components/Radio/Radio";

import {
  Variable,
  Link,
  Stock,
  Flow,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";

function HomeImp() {
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

  const [deleteItem, setDeleteItem] = useState<boolean>(false);

  const [
    cmdZoomIn,
    cmdZoomOut,
    cmdUndo,
    cmdRedo,
    handlerCanUndoChanged,
    handlerCanRedoChanged,
    menus,
  ] = useMenu(setItems0, items);

  const [
    lableDeleteItem,
    labelDragFromVariable,
    modeDragFromVariable,
    modesDragFromVariable,
    handleModeDragFromVariableClick,
    labelDoubleClickOnLink,
    modeDoubleClickOnLink,
    modesDoubleClickOnLink,
    handleModeDoubleClickOnLink,
  ] = useMode();

  function handleItemsChange(items: IItems): void {
    setItems(items);
  }

  function handleDeleteItem(): void {
    setDeleteItem(!deleteItem);
  }

  return (
    <>
      <Suspense>
        <MenuBar menus={menus} />
        <div className="flex">
          <Checkbox
            label={lableDeleteItem}
            checked={deleteItem}
            onChange={handleDeleteItem}
          />
          <div className="flex border">
            <label className="m-4">{labelDragFromVariable + ": "}</label>
            {modesDragFromVariable.map((item, i) => {
              return (
                <Radio
                  key={"mode-" + i}
                  label={item.label}
                  value={item.mode}
                  checked={modeDragFromVariable === item.mode}
                  onClick={handleModeDragFromVariableClick}
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
                  checked={modeDoubleClickOnLink === item.mode}
                  onClick={handleModeDoubleClickOnLink}
                />
              );
            })}
          </div>
        </div>
      </Suspense>
      <SystemMapCanvas
        mode={modeDragFromVariable}
        toggleLinkDirection={modeDoubleClickOnLink}
        deleteItem={deleteItem}
        cmdZoomIn={cmdZoomIn}
        cmdZoomOut={cmdZoomOut}
        cmdUndo={cmdUndo}
        cmdRedo={cmdRedo}
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
