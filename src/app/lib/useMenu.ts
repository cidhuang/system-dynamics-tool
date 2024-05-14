import { useState } from "react";
import { useTranslation } from "next-export-i18n";
import { IMenu } from "@/components/MenuBar/lib/types";

export function useMenu(): [
  number,
  number,
  number,
  number,
  (canUndo: boolean) => void,
  (canRedo: boolean) => void,
  Array<IMenu>,
] {
  const { t } = useTranslation();

  const [cmdZoomIn, setCmdZoomIn] = useState<number>(1);
  const [cmdZoomOut, setCmdZoomOut] = useState<number>(1);

  const [cmdUndo, setCmdUndo] = useState<number>(1);
  const [cmdRedo, setCmdRedo] = useState<number>(1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  function handleMenuItem(arg: any) {
    console.log("handleMenuItem", arg);
  }

  function handleZoomIn(arg: any) {
    setCmdZoomIn(cmdZoomIn + 1);
  }
  function handleZoomOut(arg: any) {
    setCmdZoomOut(cmdZoomOut + 1);
  }

  function handleUndo(arg: any) {
    setCmdUndo(cmdUndo + 1);
  }
  function handleRedo(arg: any) {
    setCmdRedo(cmdRedo + 1);
  }

  function handleCanUndoChanged(canUndo: boolean) {
    setCanUndo(canUndo);
  }
  function handleCanRedoChanged(canRedo: boolean) {
    setCanRedo(canRedo);
  }

  const menus: Array<IMenu> = [
    {
      label: t("File"),
      items: [
        {
          label: t("New"),
          handler: handleMenuItem,
          arg: "New",
        },
        {
          label: t("Save"),
          handler: handleMenuItem,
          arg: "Save",
        },
        {
          label: t("Load"),
          handler: handleMenuItem,
          arg: "Load",
        },
        {
          label: t("Save As"),
          handler: handleMenuItem,
          arg: "Save As",
        },
        {
          label: t("Import"),
          handler: handleMenuItem,
          arg: "Import",
        },
        {
          label: t("Export"),
          handler: handleMenuItem,
          arg: "Export",
        },
      ],
    },
    {
      label: t("Edit"),
      items: [
        {
          label: t("Undo"),
          handler: handleUndo,
          arg: "Undo",
          enabled: canUndo,
        },
        {
          label: t("Redo"),
          handler: handleRedo,
          arg: "Redo",
          enabled: canRedo,
        },
      ],
    },
    {
      label: t("View"),
      items: [
        {
          label: t("Zoom In"),
          handler: handleZoomIn,
          arg: "Zoom In",
          enabled: true,
        },
        {
          label: t("Zoom Out"),
          handler: handleZoomOut,
          arg: "Zoom Out",
          enabled: true,
        },
      ],
    },
    {
      label: t("Tool"),
      items: [
        {
          label: t("Find Loops"),
          handler: handleMenuItem,
          arg: "Find Loops",
        },
        {
          label: t("Find Archetypes"),
          handler: handleMenuItem,
          arg: "Find Archetypes",
        },
        {
          label: t("Auto Position"),
          handler: handleMenuItem,
          arg: "Auto Position",
        },
      ],
    },
  ];

  return [
    cmdZoomIn,
    cmdZoomOut,
    cmdUndo,
    cmdRedo,
    handleCanUndoChanged,
    handleCanRedoChanged,
    menus,
  ];
}
