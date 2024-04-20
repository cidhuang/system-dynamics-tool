
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
