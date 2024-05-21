import { useState, MutableRefObject } from "react";
import { useTranslation } from "next-export-i18n";

import { SystemMapCanvasRef } from "@/components/SystemMapCanvas/SystemMapCanvas";
import {
  IStateCanvasModes,
  ESystemMapCanvasModeDragFromVariableStock,
  ESystemMapCanvasModeDoubleClickOnLink,
} from "@/components/SystemMapCanvas/reducer/types";

export function useMode(
  canvasRef: MutableRefObject<SystemMapCanvasRef>,
  canvasModes: IStateCanvasModes,
): [
  string,
  () => void,
  string,
  Array<{
    label: string;
    mode: ESystemMapCanvasModeDragFromVariableStock;
    icon: string;
    handler: (mode: ESystemMapCanvasModeDragFromVariableStock) => void;
  }>,
  string,
  Array<{
    label: string;
    mode: ESystemMapCanvasModeDoubleClickOnLink;
    icon: string;
    handler: (mode: ESystemMapCanvasModeDoubleClickOnLink) => void;
  }>,
] {
  const { t } = useTranslation();

  function handleDeleteItem(): void {
    canvasRef.current?.setModes({
      ...canvasModes,
      doubleClickToDeleteItem: !canvasModes.doubleClickToDeleteItem,
    });
  }

  function handleModeDragFromVariableStockClick(
    mode: ESystemMapCanvasModeDragFromVariableStock,
  ): void {
    canvasRef.current?.setModes({
      ...canvasModes,
      dragFromVariableStock: mode,
    });
  }

  function handleModeDoubleClickOnLink(
    mode: ESystemMapCanvasModeDoubleClickOnLink,
  ): void {
    canvasRef.current?.setModes({
      ...canvasModes,
      doubleClickOnLink: mode,
    });
  }

  const lableDeleteItem = t("Double click to delete Item");

  const labelDragFromVariableStock = t("Drag from Variable");
  const modesDragFromVariableStock = [
    {
      label: t("Move Variable"),
      mode: ESystemMapCanvasModeDragFromVariableStock.MoveVariableStock,
      icon: "move.png",
      handler: handleModeDragFromVariableStockClick,
    },
    {
      label: t("Add Link"),
      mode: ESystemMapCanvasModeDragFromVariableStock.AddLinkFlow,
      icon: "link.png",
      handler: handleModeDragFromVariableStockClick,
    },
  ];

  const labelDoubleClickOnLink = t("Double click on Link");
  const modesDoubleClickOnLink = [
    {
      label: t("Toggle Relation"),
      mode: ESystemMapCanvasModeDoubleClickOnLink.ToggleRelation,
      icon: "relation.png",
      handler: handleModeDoubleClickOnLink,
    },
    {
      label: t("Toggle Direction"),
      mode: ESystemMapCanvasModeDoubleClickOnLink.ToggleDirection,
      icon: "direction.png",
      handler: handleModeDoubleClickOnLink,
    },
  ];

  return [
    lableDeleteItem,
    handleDeleteItem,
    labelDragFromVariableStock,
    modesDragFromVariableStock,
    labelDoubleClickOnLink,
    modesDoubleClickOnLink,
  ];
}
