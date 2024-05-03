import { IStateCanvas, ESystemMapCanvasMode, EStateCanvas } from "./types";

const mode = ["Mode"] as const;
type Mode = (typeof mode)[number];
export const isMode = (x: any): x is Mode => mode.includes(x);
export type ActionMode = { type: "Mode"; mode: ESystemMapCanvasMode };

// Reducer
export function reducerMode(
  state: IStateCanvas,
  action: ActionMode,
): IStateCanvas {
  return {
    ...state,
    mode: action.mode,
    state: EStateCanvas.Idle,
  };
}
