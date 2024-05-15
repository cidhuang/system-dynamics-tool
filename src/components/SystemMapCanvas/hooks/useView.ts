import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Application, ICanvas } from "pixi.js";
import { IStateCanvas } from "../reducer/types";
import { indexOf, isVariable, isLink, getPoint4View } from "../lib/types";
import { isOnLink, updateViewLink, addViewLink } from "../lib/view/link";
import {
  isOnVariable,
  updateViewVariable,
  addViewVariable,
} from "../lib/view/variable";
import { Point } from "../lib/geometry";

export function useView(
  state: IStateCanvas,
): [
  Application<ICanvas> | undefined,
  Dispatch<SetStateAction<Application<ICanvas> | undefined>>,
  (xyCanvas: Point, xyMap: Point) => string,
] {
  const [app, setApp] = useState<Application<ICanvas>>();
  useEffect(() => {
    if (app === undefined) {
      return;
    }

    for (let i = 0; i < state.items.links.length; i++) {
      const link = state.items.links[i];
      const startV =
        state.items.variables[indexOf(state.items.variables, link.start)];
      const endV =
        state.items.variables[indexOf(state.items.variables, link.end)];

      const start = getPoint4View(startV, endV.xy, link.mid);
      const end = getPoint4View(endV, startV.xy, link.mid);

      if (
        !updateViewLink(app.stage, link.name, link.isPlus, start, end, link.mid)
      ) {
        addViewLink(app.stage, link.name, start, end);
      }
    }

    for (let i = 0; i < state.items.variables.length; i++) {
      const variable = state.items.variables[i];
      if (!updateViewVariable(app.stage, variable)) {
        addViewVariable(app.stage, variable);
      }
    }

    for (let i = app?.stage.children.length - 1; i >= 0; i--) {
      const name = app?.stage.children[i].name ?? "";

      if (isLink(name) && indexOf(state.items.links, name) < 0) {
        app?.stage.removeChildAt(i);
      }

      if (isVariable(name) && indexOf(state.items.variables, name) < 0) {
        app?.stage.removeChildAt(i);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items]);

  // drag link
  useEffect(() => {
    if (app === undefined) {
      return;
    }

    let startV = undefined;
    if (state.dragStart !== undefined) {
      const index = indexOf(state.items.variables, state.dragStart);
      if (index >= 0) {
        startV = state.items.variables[index];
      }
    }

    let endPoint = undefined;
    let endV = undefined;
    if (state.dragLinkEnd !== undefined) {
      if (typeof state.dragLinkEnd === "string") {
        const index = indexOf(state.items.variables, state.dragLinkEnd);
        if (index >= 0) {
          endV = state.items.variables[index];
          endPoint = endV.xy;
        }
      } else {
        endPoint = state.dragLinkEnd;
      }
    }

    const dragLink = indexOf(app?.stage.children, "dragLink");

    if (startV === undefined || endPoint === undefined) {
      if (dragLink >= 0) {
        app?.stage.removeChildAt(dragLink);
      }
      return;
    }

    const startPoint = getPoint4View(startV, endPoint);
    let end = endPoint;
    if (endV !== undefined) {
      end = getPoint4View(endV, startV.xy);
    }

    if (dragLink >= 0) {
      updateViewLink(app?.stage, "dragLink", true, startPoint, end);
      return;
    }

    if (state.dragStart === undefined) {
      return;
    }

    if (state.dragStart === state.dragLinkEnd) {
      return;
    }

    addViewLink(app?.stage, "dragLink", startPoint, end);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dragLinkEnd, state.dragLinkMid]);

  function itemName(xyCanvas: Point, xyMap: Point): string {
    if (app === undefined) {
      return "";
    }

    if (app?.stage === null) {
      return "";
    }

    for (let i = 0; i < app?.stage.children.length; i++) {
      const item = app?.stage.children[i];
      if (item.name === null) {
        continue;
      }

      if (isVariable(item.name)) {
        if (isOnVariable(item, xyCanvas)) {
          return item.name;
        }
      }

      if (isLink(item.name)) {
        if (isOnLink(item, xyMap)) {
          return item.name;
        }
      }
    }

    return "";
  }

  return [app, setApp, itemName];
}
