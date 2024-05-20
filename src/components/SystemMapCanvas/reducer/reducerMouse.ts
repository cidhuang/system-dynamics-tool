import {
  isVariable,
  createVariable,
  isStock,
  createStock,
  isLink,
  createLink,
  isFlow,
  createFlow,
} from "@/components/SystemMapCanvas/lib/types";
import { Point } from "../lib/geometry";

import {
  EStateCanvas,
  IStateCanvas,
  MouseReducers,
  StateReducers,
  ESystemMapCanvasModeDragFromVariableStock,
  ESystemMapCanvasModeDoubleClickOnLink,
} from "./types";

const mouse = [
  "MouseLeftDown",
  "MouseLeftUp",
  "MouseMove",
  "MouseLeftDoubleClick",
] as const;
type Mouse = (typeof mouse)[number];
export const isMouse = (x: any): x is Mouse => mouse.includes(x);
export type ActionMouse = { type: Mouse; xy: Point; item: string };

function reducerIdleDown(state: IStateCanvas, xy: Point, item: string) {
  if (isLink(item)) {
    return {
      ...state,
      state: EStateCanvas.ShapingLink,
      dragStart: item,
    };
  }
  if (isFlow(item)) {
    return {
      ...state,
      state: EStateCanvas.ShapingFlow,
      dragStart: item,
    };
  }
  if (
    state.modes.dragFromVariableStock ===
    ESystemMapCanvasModeDragFromVariableStock.MoveVariableStock
  ) {
    if (isVariable(item)) {
      return {
        ...state,
        state: EStateCanvas.MovingVariable,
        dragStart: item,
      };
    }
    if (isStock(item)) {
      return {
        ...state,
        state: EStateCanvas.MovingStock,
        dragStart: item,
      };
    }
  }
  if (
    state.modes.dragFromVariableStock ===
    ESystemMapCanvasModeDragFromVariableStock.AddLinkFlow
  ) {
    if (isVariable(item) || isStock(item)) {
      return {
        ...state,
        state: EStateCanvas.DragginNewLinkFlow,
        dragStart: item,
      };
    }
  }

  return state;
}

function removeVariable(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);

  items.variables = items.variables.filter(
    (varialbe) => varialbe.name !== item,
  );
  items.links = items.links.filter(
    (link) => link.start !== item && link.end !== item,
  );

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function variableToStock(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function stockToVariable(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function removeLink(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);

  items.links = items.links.filter((link) => link.name !== item);

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function toggleLinkRelation(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);
  const index = items.links.findIndex((link) => link.name === item);

  if (index < 0) {
    alert();
    return state;
  }
  const link = items.links[index];
  link.isPlus = !link.isPlus;

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function toggleLinkDirection(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);
  const index = items.links.findIndex((link) => link.name === item);

  if (index < 0) {
    alert();
    return state;
  }
  const link = items.links[index];
  const tmp = link.start;
  link.start = link.end;
  link.end = tmp;

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function reverseFlowDirection(state: IStateCanvas, item: string): IStateCanvas {
  let items = structuredClone(state.items);

  return {
    ...state,
    items: items,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

function reducerIdleDoubleClick(state: IStateCanvas, xy: Point, item: string) {
  if (item === "") {
    let items = structuredClone(state.items);
    const name = createVariable(items.variables, xy);
    return {
      ...state,
      items: items,
      cmdUndoAdd: state.cmdUndoAdd + 1,
    };
  }

  if (isVariable(item)) {
    if (state.modes.doubleClickToDeleteItem) {
      return removeVariable(state, item);
    }
    return variableToStock(state, item);
  }

  if (isStock(item)) {
    return stockToVariable(state, item);
  }

  if (isLink(item)) {
    if (state.modes.doubleClickToDeleteItem) {
      return removeLink(state, item);
    }
    if (
      state.modes.doubleClickOnLink ===
      ESystemMapCanvasModeDoubleClickOnLink.ToggleDirection
    ) {
      return toggleLinkDirection(state, item);
    }
    return toggleLinkRelation(state, item);
  }

  if (isFlow(item)) {
    return reverseFlowDirection(state, item);
  }

  return state;
}

const reducersIdle: MouseReducers = {
  MouseLeftDown: reducerIdleDown,
  MouseLeftDoubleClick: reducerIdleDoubleClick,
};

function reducerMovingVariableMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  if (state.dragStart === undefined) {
    return state;
  }
  let items = structuredClone(state.items);
  const i = items.variables.findIndex(
    (variable) => variable.name === state.dragStart,
  );
  items.variables[i].xy = xy;
  return {
    ...state,
    items: items,
  };
}

function reducerMovingVariableUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

const reducersMovingVariable: MouseReducers = {
  MouseMove: reducerMovingVariableMove,
  MouseLeftUp: reducerMovingVariableUp,
};

function reducerMovingStockMove(state: IStateCanvas, xy: Point, item: string) {
  return state;
}

function reducerMovingStockUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

const reducersMovingStock: MouseReducers = {
  MouseMove: reducerMovingStockMove,
  MouseLeftUp: reducerMovingStockUp,
};

function reducerShapingLinkMove(state: IStateCanvas, xy: Point, item: string) {
  if (state.dragStart === undefined) {
    return state;
  }
  let items = structuredClone(state.items);
  const i = items.links.findIndex((link) => link.name === state.dragStart);
  items.links[i].mid = xy;
  return {
    ...state,
    items: items,
  };
}

function reducerShapingLinkUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

const reducersShapingLink: MouseReducers = {
  MouseMove: reducerShapingLinkMove,
  MouseLeftUp: reducerShapingLinkUp,
};

function reducerShapingFlowMove(state: IStateCanvas, xy: Point, item: string) {
  return state;
}

function reducerShapingFlowUp(state: IStateCanvas, xy: Point, item: string) {
  return {
    ...state,
    state: EStateCanvas.Idle,
    cmdUndoAdd: state.cmdUndoAdd + 1,
  };
}

const reducersShapingFlow: MouseReducers = {
  MouseMove: reducerShapingFlowMove,
  MouseLeftUp: reducerShapingFlowUp,
};

function reducerDragginNewLinkFlowMove(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  if (state.dragStart === undefined) {
    return state;
  }

  if (isVariable(state.dragStart)) {
    if (isVariable(item) || isFlow(item)) {
      return {
        ...state,
        dragLinkEnd: item,
      };
    }
    return {
      ...state,
      dragLinkEnd: xy,
    };
  }

  return state;
}

function reducerDragginNewLinkFlowUp(
  state: IStateCanvas,
  xy: Point,
  item: string,
) {
  if (state.dragStart === undefined) {
    return state;
  }

  if (isVariable(state.dragStart)) {
    if (isVariable(item) || isFlow(item)) {
      if (state.dragStart !== item) {
        let items = structuredClone(state.items);
        const name = createLink(items.links, state.dragStart, item);
        return {
          ...state,
          state: EStateCanvas.Idle,
          items: items,
          cmdUndoAdd: state.cmdUndoAdd + 1,
          dragLinkEnd: undefined,
        };
      }
    }
  }

  if (isStock(state.dragStart)) {
    if (state.dragStart !== item) {
      let items = structuredClone(state.items);
      let name;
      if (isStock(item)) {
        name = createFlow(items.flows, state.dragStart, item);
      }
      if (item === "") {
        name = createFlow(items.flows, state.dragStart, xy);
      }
      return {
        ...state,
        state: EStateCanvas.Idle,
        items: items,
        cmdUndoAdd: state.cmdUndoAdd + 1,
      };
    }
  }

  return {
    ...state,
    state: EStateCanvas.Idle,
    dragStart: undefined,
    dragLinkEnd: undefined,
  };
}

const reducersDragginNewLinkFlow: MouseReducers = {
  MouseMove: reducerDragginNewLinkFlowMove,
  MouseLeftUp: reducerDragginNewLinkFlowUp,
};

const reducers: StateReducers = {
  [EStateCanvas.Idle]: reducersIdle,
  [EStateCanvas.MovingVariable]: reducersMovingVariable,
  [EStateCanvas.MovingStock]: reducersMovingStock,
  [EStateCanvas.ShapingLink]: reducersShapingLink,
  [EStateCanvas.ShapingFlow]: reducersShapingFlow,
  [EStateCanvas.DragginNewLinkFlow]: reducersDragginNewLinkFlow,
};

export function reducerMouse(
  state: IStateCanvas,
  action: ActionMouse,
): IStateCanvas {
  const reducer = reducers[state.state][action.type];
  if (reducer === undefined) {
    return state;
  }

  const r = reducer(state, action.xy, action.item);

  //console.log(r);

  return r;
}
