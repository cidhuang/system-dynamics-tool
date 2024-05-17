import { useState } from "react";
import { useTranslation } from "next-export-i18n";
import { ESystemMapCanvasMode } from "@/components/SystemMapCanvas/reducer/types";

export function useMode(): [
  ESystemMapCanvasMode,
  Array<{ label: string; mode: ESystemMapCanvasMode }>,
  (mode: ESystemMapCanvasMode) => void,
  string,
  string,
] {
  const { t } = useTranslation();

  const [mode, setMode] = useState<ESystemMapCanvasMode>(
    ESystemMapCanvasMode.MoveVariableStock,
  );

  function handleModeClick(mode1: ESystemMapCanvasMode) {
    setMode(mode1);
  }

  const modes = [
    {
      label: t("Move Variable / Stock"),
      mode: ESystemMapCanvasMode.MoveVariableStock,
    },
    { label: t("Add Link / Flow"), mode: ESystemMapCanvasMode.AddLinkFlow },
  ];

  const labelToggleLinkDirection = t("Toogle Link Direction");
  const lableDeleteItem = t("Delete Item");

  return [
    mode,
    modes,
    handleModeClick,
    labelToggleLinkDirection,
    lableDeleteItem,
  ];
}
