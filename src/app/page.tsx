"use client";

import { Suspense, useState } from "react";

import { useMenu } from "./lib/useMenu";
import { useMode } from "./lib/useMode";
import { useItem } from "./lib/useItem";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import { SystemMapCanvasMode } from "@/components/SystemMapCanvas/SystemMapCanvasMode";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";

function HomeImp() {
  const [
    cmdZoomIn,
    cmdZoomOut,
    cmdUndo,
    cmdRedo,
    handlerCanUndoChanged,
    handlerCanRedoChanged,
    menus,
  ] = useMenu();
  const [
    mode,
    modes,
    handleModeClick,
    labelToggleLinkDirection,
    lableDeleteItem,
  ] = useMode();
  const [items, handleItemsChange] = useItem();

  const [toggleLinkDirection, setToggleLinkDirection] =
    useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState<boolean>(false);

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
            onClick={() => {
              setToggleLinkDirection(!toggleLinkDirection);
            }}
            className={toggleLinkDirection ? "btn-mode-selected" : "btn-mode"}
          >
            {labelToggleLinkDirection}
          </button>
          <button
            onClick={() => {
              setDeleteItem(!deleteItem);
            }}
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
        items={items}
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
