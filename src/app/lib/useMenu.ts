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

  function handlerMenuItem(arg: any) {
    console.log("handlerMenuItem", arg);
  }

  function handlerZoomIn(arg: any) {
    setCmdZoomIn(cmdZoomIn + 1);
  }
  function handlerZoomOut(arg: any) {
    setCmdZoomOut(cmdZoomOut + 1);
  }

  function handlerUndo(arg: any) {
    setCmdUndo(cmdUndo + 1);
  }
  function handlerRedo(arg: any) {
    setCmdRedo(cmdRedo + 1);
  }

  function handlerCanUndoChanged(canUndo: boolean) {
    setCanUndo(canUndo);
  }
  function handlerCanRedoChanged(canRedo: boolean) {
    setCanRedo(canRedo);
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
          handler: handlerUndo,
          arg: "Undo",
          disabled: !canUndo,
        },
        {
          label: t("Redo"),
          handler: handlerRedo,
          arg: "Redo",
          disabled: !canRedo,
        },
      ],
    },
    {
      label: t("View"),
      items: [
        {
          label: t("Zoom In"),
          handler: handlerZoomIn,
          arg: "Zoom In",
        },
        {
          label: t("Zoom Out"),
          handler: handlerZoomOut,
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

  return [
    cmdZoomIn,
    cmdZoomOut,
    cmdUndo,
    cmdRedo,
    handlerCanUndoChanged,
    handlerCanRedoChanged,
    menus,
  ];
}
