import { useState } from "react";
import { useTranslation } from "next-export-i18n";
import { IMenu } from "@/components/MenuBar/lib/types";

export function useMenu(): [number, number, Array<IMenu>] {
  const { t } = useTranslation();

  const [zoomIn, setZoomIn] = useState<number>(1);
  const [zoomOut, setZoomOut] = useState<number>(1);

  function handlerMenuItem(arg: any) {
    console.log("handlerMenuItem", arg);
  }

  function handleZoomInOut(arg: any) {
    if (arg == "Zoom In") {
      setZoomIn(zoomIn + 1);
    }
    if (arg == "Zoom Out") {
      setZoomOut(zoomOut + 1);
    }
  }

  const menus: Array<IMenu> = [
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
          handler: handleZoomInOut,
          arg: "Zoom In",
        },
        {
          label: t("Zoom Out"),
          handler: handleZoomInOut,
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

  return [zoomIn, zoomOut, menus];
}
