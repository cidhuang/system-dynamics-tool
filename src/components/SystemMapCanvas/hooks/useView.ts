import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Application, ICanvas } from "pixi.js";
import { IStateCanvas } from "../reducer/types";
import { isVariable, isLink, getIntersection } from "../lib/types";
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

    for (const link of state.items.links) {
      const startV = state.items.variables.find(
        (varialbe) => varialbe.name === link.start,
      );
      const endV = state.items.variables.find(
        (variable) => variable.name === link.end,
      );

      if (startV === undefined || endV === undefined) {
        continue;
      }

      const start = getIntersection(startV, endV.xy, link.mid);
      const end = getIntersection(endV, startV.xy, link.mid);

      if (
        !updateViewLink(app.stage, link.name, link.isPlus, start, end, link.mid)
      ) {
        addViewLink(app.stage, link.name, start, end);
      }
    }

    for (const variable of state.items.variables) {
      if (!updateViewVariable(app.stage, variable)) {
        addViewVariable(app.stage, variable);
      }
    }

    for (let i = app?.stage.children.length - 1; i >= 0; i--) {
      const name = app?.stage.children[i].name ?? "";

      if (
        isLink(name) &&
        state.items.links.findIndex((link) => link.name === name) < 0
      ) {
        app?.stage.removeChildAt(i);
      }

      if (
        isVariable(name) &&
        state.items.variables.findIndex((variable) => variable.name === name) <
          0
      ) {
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
      startV = state.items.variables.find(
        (variable) => variable.name === state.dragStart,
      );
    }

    let endPoint = undefined;
    let endV = undefined;
    if (state.dragLinkEnd !== undefined) {
      if (typeof state.dragLinkEnd === "string") {
        endV = state.items.variables.find(
          (variable) => variable.name === state.dragLinkEnd,
        );
        if (endV !== undefined) {
          endPoint = endV.xy;
        }
      } else {
        endPoint = state.dragLinkEnd;
      }
    }

    const dragLink = app?.stage.children.findIndex(
      (child) => child.name === "dragLink",
    );

    if (startV === undefined || endPoint === undefined) {
      if (dragLink >= 0) {
        app?.stage.removeChildAt(dragLink);
      }
      return;
    }

    const startPoint = getIntersection(startV, endPoint);
    let end = endPoint;
    if (endV !== undefined) {
      end = getIntersection(endV, startV.xy);
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

    for (const item of app?.stage.children) {
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
