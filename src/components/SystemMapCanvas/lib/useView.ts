import { useEffect } from "react";
import { Application, ICanvas } from "pixi.js";
import { IStateCanvas } from "../reducer/types";
import { indexOf, Point } from "./types";
import { isVariable, isLink } from "./types";
import { isOnLink, updateViewLink, addViewLink } from "./link";
import { isOnVariable, updateViewVariable, addViewVariable } from "./variable";

export function useView(
  app: Application<ICanvas> | undefined,
  state: IStateCanvas,
): [(xyCanvas: Point, xyMap: Point) => string] {
  useEffect(() => {
    if (app === undefined) {
      return;
    }

    for (let i = 0; i < state.items.links.length; i++) {
      const link = state.items.links[i];
      const start =
        state.items.variables[indexOf(state.items.variables, link.start)].xy;
      const end =
        state.items.variables[indexOf(state.items.variables, link.end)].xy;
      if (!updateViewLink(app.stage, link.name, start, end, link.mid)) {
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

    let startPoint = undefined;
    if (state.dragStart !== undefined) {
      const index = indexOf(state.items.variables, state.dragStart);
      if (index >= 0) {
        startPoint = state.items.variables[index].xy;
      }
    }

    let endPoint = undefined;
    if (state.dragLinkEnd !== undefined) {
      if (typeof state.dragLinkEnd === "string") {
        const index = indexOf(state.items.variables, state.dragLinkEnd);
        if (index >= 0) {
          endPoint = state.items.variables[index].xy;
        }
      } else {
        endPoint = state.dragLinkEnd;
      }
    }

    const dragLink = indexOf(app?.stage.children, "dragLink");

    if (startPoint === undefined || endPoint === undefined) {
      if (dragLink >= 0) {
        app?.stage.removeChildAt(dragLink);
      }
      return;
    }

    if (dragLink >= 0) {
      updateViewLink(app?.stage, "dragLink", startPoint, endPoint);
      return;
    }

    if (state.dragStart === undefined) {
      return;
    }

    addViewLink(app?.stage, "dragLink", startPoint, endPoint);

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

  return [itemName];
}
