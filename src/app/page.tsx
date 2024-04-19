"use client";

import { Variable } from "@/lib/types";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import {
  SystemMapCanvasMode,
  ESystemMapCanvasMode,
} from "@/components/SystemMapCanvas/SystemMapCanvasMode";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";

import { useState, Suspense } from "react";

export default function Home() {
  const [mode, setMode] = useState<ESystemMapCanvasMode>(
    ESystemMapCanvasMode.Change
  );
  const variables = new Array<Variable>();

  function handleVariablesChange(variables: Variable[]): void {}

  function handleModeClick(mode1: ESystemMapCanvasMode) {
    setMode(mode1);
  }

  function handlerMenuItem(arg: any) {
    console.log("handlerMenuItem", arg);
  }

  const menus = [
    {
      label: "File",
      items: [
        {
          label: "New",
          handler: handlerMenuItem,
          arg: "New",
        },
        {
          label: "Save",
          handler: handlerMenuItem,
          arg: "Save",
        },
        {
          label: "Load",
          handler: handlerMenuItem,
          arg: "Load",
        },
        {
          label: "Save As",
          handler: handlerMenuItem,
          arg: "Save As",
        },
      ],
    },
    {
      label: "Edit",
      items: [
        {
          label: "Undo",
          handler: handlerMenuItem,
          arg: "Undo",
        },
        {
          label: "Redo",
          handler: handlerMenuItem,
          arg: "Redo",
        },
      ],
    },
    {
      label: "Tool",
      items: [
        {
          label: "Find Loops",
          handler: handlerMenuItem,
          arg: "Find Loops",
        },
        {
          label: "Find Archetypes",
          handler: handlerMenuItem,
          arg: "Find Archetypes",
        },
        {
          label: "Auto Position",
          handler: handlerMenuItem,
          arg: "Auto Position",
        },
      ],
    },
  ];

  const modes = [
    { label: "Change", mode: ESystemMapCanvasMode.Change },
    { label: "Add Variable", mode: ESystemMapCanvasMode.AddVariable },
    { label: "Add Link", mode: ESystemMapCanvasMode.AddLink },
    { label: "Add Stock", mode: ESystemMapCanvasMode.AddStock },
    { label: "Add Flow", mode: ESystemMapCanvasMode.AddFlow },
  ];

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
        variables={variables}
        onVariablesChange={handleVariablesChange}
      />
    </>
  );
}
