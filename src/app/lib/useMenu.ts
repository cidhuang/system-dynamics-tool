import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  MutableRefObject,
} from "react";
import { useTranslation } from "next-export-i18n";

import { useFilePicker } from "use-file-picker";
import saveFile from "save-as-file";

import { IMenu } from "@/components/MenuBar/lib/types";
import { SystemMapCanvasRef } from "@/components/SystemMapCanvas/SystemMapCanvas";

import {
  Variable,
  Link,
  Stock,
  Flow,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";

import { save } from "@tauri-apps/api/dialog";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

export function useMenu(
  canvasRef: MutableRefObject<SystemMapCanvasRef>,
  setItems0: Dispatch<SetStateAction<IItems>>,
  items: IItems,
): [
  (canUndo: boolean) => void,
  (canRedo: boolean) => void,
  Array<IMenu>,
  (arg: any) => void,
  (arg: any) => void,
  string,
  string,
  boolean,
  boolean,
] {
  const { t } = useTranslation();

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: ".json",
    multiple: false,
  });

  const labelUndo = t("Undo");
  const labelRedo = t("Redo");

  useEffect(() => {
    if (loading) {
      return;
    }
    if (filesContent[0] === undefined) {
      return;
    }
    const items0 = JSON.parse(filesContent[0].content);
    setItems0(items0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent]);

  function handleMenuItem(arg: any) {
    console.log("handleMenuItem", arg);
  }

  function handleNew(arg: any) {
    setItems0({
      variables: new Array<Variable>(),
      links: new Array<Link>(),
      stocks: new Array<Stock>(),
      flows: new Array<Flow>(),
    });
  }

  function handleSave(arg: any) {
    console.log("handleSave", arg);
  }

  function handleLoad(arg: any) {
    openFilePicker();
  }

  async function handleSaveAs(arg: any) {
    const json = JSON.stringify(items);
    if (!window.__TAURI__) {
      const file = new File([json], "", { type: "application/json" });
      saveFile(file, "system-map.json");
      return;
    }

    const filePath = await save({
      filters: [
        {
          name: "System Map",
          extensions: ["json"],
        },
      ],
    });

    if (!filePath) {
      return;
    }

    await writeTextFile(filePath, json, {
      dir: BaseDirectory.AppConfig,
    });
  }

  function handleZoomIn(arg: any) {
    canvasRef.current?.zoomIn();
  }
  function handleZoomOut(arg: any) {
    canvasRef.current?.zoomOut();
  }

  function handleUndo(arg: any) {
    canvasRef.current?.undo();
  }
  function handleRedo(arg: any) {
    canvasRef.current?.redo();
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
          handler: handleNew,
          arg: "New",
          enabled: true,
        },
        {
          label: t("Save"),
          handler: handleSave,
          arg: "Save",
        },
        {
          label: t("Load"),
          handler: handleLoad,
          arg: "Load",
          enabled: true,
        },
        {
          label: t("Save As"),
          handler: handleSaveAs,
          arg: "Save As",
          enabled: true,
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
    handleCanUndoChanged,
    handleCanRedoChanged,
    menus,
    handleUndo,
    handleRedo,
    labelUndo,
    labelRedo,
    canUndo,
    canRedo,
  ];
}
