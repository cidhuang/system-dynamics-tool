import { useTranslation } from "next-export-i18n";

import "./SystemMapCanvasMode.css";

export enum ESystemMapCanvasMode {
  Change,
  AddVariable,
  AddLink,
  AddStock,
  AddFlow,
}

export const SystemMapCanvasMode = ({
  label,
  mode,
  selected,
  onClick,
}: {
  label: string;
  mode: ESystemMapCanvasMode;
  selected: boolean;
  onClick: (mode: ESystemMapCanvasMode) => void;
}) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => {
        onClick(mode);
      }}
      className={selected ? "btn-mode-selected" : "btn-mode"}
    >
      {t(label)}
    </button>
  );
};
