"use client";

import { Suspense } from "react";

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
  const [mode, modes, handleModeClick] = useMode();
  const [items, handleItemsChange] = useItem();

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
        </div>
      </Suspense>
      <SystemMapCanvas
        mode={mode}
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
