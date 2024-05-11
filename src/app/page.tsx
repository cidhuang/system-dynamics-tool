"use client";

import { Suspense } from "react";

import { useMenu } from "./lib/useMenu";
import { useMode } from "./lib/useMode";
import { useItem } from "./lib/useItem";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import { SystemMapCanvasMode } from "@/components/SystemMapCanvas/SystemMapCanvasMode";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";

function HomeImp() {
  const [zoomIn, zoomOut, menus] = useMenu();
  const [mode, modes, handleModeClick] = useMode();
  const [
    variables,
    links,
    stocks,
    flows,
    handleVariablesChange,
    handleLinksChange,
    handleStocksChange,
    handleFlowsChange,
  ] = useItem();

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
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        variables={variables}
        onVariablesChange={handleVariablesChange}
        links={links}
        onLinksChange={handleLinksChange}
        stocks={stocks}
        onStocksChange={handleStocksChange}
        flows={flows}
        onFlowsChange={handleFlowsChange}
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
