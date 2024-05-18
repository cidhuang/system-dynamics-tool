"use client";

import { Suspense, useState } from "react";

import { useMenu } from "./lib/useMenu";
import { useMode } from "./lib/useMode";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import { SystemMapCanvasMode } from "@/components/SystemMapCanvas/SystemMapCanvasMode";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";

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

  const [toggleLinkDirection, setToggleLinkDirection] =
    useState<boolean>(false);
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
    mode,
    modes,
    handleModeClick,
    labelToggleLinkDirection,
    lableDeleteItem,
  ] = useMode();

  function handleItemsChange(items: IItems): void {
    setItems(items);
  }

  function handleToggleLinkDirection(): void {
    setToggleLinkDirection(!toggleLinkDirection);
  }

  function handleDeleteItem(): void {
    setDeleteItem(!deleteItem);
  }

  return (
    <>
      <Suspense>
        <MenuBar menus={menus} />
        <div className="flex">
          {modes.map((item, i) => {
            return (
              <SystemMapCanvasMode
                key={"mode-" + i}
                label={item.label}
                mode={item.mode}
                selected={mode === item.mode}
                onClick={handleModeClick}
              />
            );
          })}
          <button
            onClick={handleToggleLinkDirection}
            className={toggleLinkDirection ? "btn-mode-selected" : "btn-mode"}
          >
            {labelToggleLinkDirection}
          </button>
          <button
            onClick={handleDeleteItem}
            className={deleteItem ? "btn-mode-selected" : "btn-mode"}
          >
            {lableDeleteItem}
          </button>
        </div>
      </Suspense>
      <SystemMapCanvas
        mode={mode}
        toggleLinkDirection={toggleLinkDirection}
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
