"use client";

import { useState, Suspense } from "react";
import { useTranslation } from "next-export-i18n";

import { Variable } from "@/lib/types";

import { MenuBar } from "@/components/MenuBar/MenuBar";
import {
  SystemMapCanvasMode,
  ESystemMapCanvasMode,
} from "@/components/SystemMapCanvas/SystemMapCanvasMode";
import { SystemMapCanvas } from "@/components/SystemMapCanvas/SystemMapCanvas";

function HomeImp() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<ESystemMapCanvasMode>(
    ESystemMapCanvasMode.Change,
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
      label: t("File"),
      items: [
        {
          label: t("New"),
          handler: handlerMenuItem,
          arg: "New",
        },
        {
          label: t("Save"),
          handler: handlerMenuItem,
          arg: "Save",
        },
        {
          label: t("Load"),
          handler: handlerMenuItem,
          arg: "Load",
        },
        {
          label: t("Save As"),
          handler: handlerMenuItem,
          arg: "Save As",
        },
        {
          label: t("Import"),
          handler: handlerMenuItem,
          arg: "Import",
        },
        {
          label: t("Export"),
          handler: handlerMenuItem,
          arg: "Export",
        },
      ],
    },
    {
      label: t("Edit"),
      items: [
        {
          label: t("Undo"),
          handler: handlerMenuItem,
          arg: "Undo",
        },
        {
          label: t("Redo"),
          handler: handlerMenuItem,
          arg: "Redo",
        },
      ],
    },
    {
      label: t("View"),
      items: [
        {
          label: t("Zoom In"),
          handler: handlerMenuItem,
          arg: "Zoom In",
        },
        {
          label: t("Zoom Out"),
          handler: handlerMenuItem,
          arg: "Zoom Out",
        },
      ],
    },
    {
      label: t("Tool"),
      items: [
        {
          label: t("Find Loops"),
          handler: handlerMenuItem,
          arg: "Find Loops",
        },
        {
          label: t("Find Archetypes"),
          handler: handlerMenuItem,
          arg: "Find Archetypes",
        },
        {
          label: t("Auto Position"),
          handler: handlerMenuItem,
          arg: "Auto Position",
        },
      ],
    },
  ];

  const language = t("__language__");

  const modes = [
    { label: t("Change"), mode: ESystemMapCanvasMode.Change },
    { label: t("Add Variable"), mode: ESystemMapCanvasMode.AddVariable },
    { label: t("Add Link"), mode: ESystemMapCanvasMode.AddLink },
    { label: t("Add Stock"), mode: ESystemMapCanvasMode.AddStock },
    { label: t("Add Flow"), mode: ESystemMapCanvasMode.AddFlow },
  ];

  return (
    <>
      <Suspense>
        <MenuBar language={language} menus={menus} />
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

export default function Home() {
  return (
    <Suspense>
      <HomeImp />
    </Suspense>
  );
}
