import "./SystemMapCanvasMode.css";
import { ESystemMapCanvasMode } from "./reducer/types";

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
  return (
    <button
      onClick={() => {
        onClick(mode);
      }}
      className={selected ? "btn-mode-selected" : "btn-mode"}
    >
      {label}
    </button>
  );
};
