import { useState } from "react";
import { useTranslation } from "next-export-i18n";
import { ESystemMapCanvasMode } from "@/components/SystemMapCanvas/reducer/types";

export function useMode(): [
  string,
  string,
  ESystemMapCanvasMode,
  Array<{ label: string; mode: ESystemMapCanvasMode }>,
  (mode: ESystemMapCanvasMode) => void,
  string,
  boolean,
  Array<{ label: string; mode: boolean }>,
  (mode: boolean) => void,
] {
  const { t } = useTranslation();

  const [modeDragFromVariable, setModeDragFromVariable] =
    useState<ESystemMapCanvasMode>(ESystemMapCanvasMode.MoveVariableStock);
  const [modeDoubleClickOnLink, setModeDoubleClickOnLink] =
    useState<boolean>(false);

  function handleModeDragFromVariableClick(mode1: ESystemMapCanvasMode) {
    setModeDragFromVariable(mode1);
  }
  function handleModeDoubleClickOnLink(mode1: boolean) {
    setModeDoubleClickOnLink(mode1);
  }

  const lableDeleteItem = t("Double click to delete Item");

  const labelDragFromVariable = t("Drag from Variable");
  const modesDragFromVariable = [
    {
      label: t("Move Variable"),
      mode: ESystemMapCanvasMode.MoveVariableStock,
    },
    {
      label: t("Add Link"),
      mode: ESystemMapCanvasMode.AddLinkFlow,
    },
  ];

  const labelDoubleClickOnLink = t("Double click on Link");
  const modesDoubleClickOnLink = [
    {
      label: t("Toggle Relation"),
      mode: false,
    },
    {
      label: t("Toggle Direction"),
      mode: true,
    },
  ];

  return [
    lableDeleteItem,
    labelDragFromVariable,
    modeDragFromVariable,
    modesDragFromVariable,
    handleModeDragFromVariableClick,
    labelDoubleClickOnLink,
    modeDoubleClickOnLink,
    modesDoubleClickOnLink,
    handleModeDoubleClickOnLink,
  ];
}
