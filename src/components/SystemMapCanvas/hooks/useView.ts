import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Application, ICanvas } from "pixi.js";
import { IStateCanvas } from "../reducer/types";
import {
  isVariable,
  isLink,
  getIntersection,
  isStock,
  Variable,
  Stock,
} from "../lib/types";
import { isOnLink, updateViewLink, addViewLink } from "../lib/view/link";
import { isOnStock, updateViewStock, addViewStock } from "../lib/view/stock";
import {
  isOnVariable,
  updateViewVariable,
  addViewVariable,
} from "../lib/view/variable";
import { Point } from "../lib/geometry";
import { ViewNode } from "../lib/view/ViewNode";

export function useView(
  state: IStateCanvas,
  scale: Point,
  selected: string,
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

    for (const variable of state.items.variables) {
      if (!updateViewVariable(app.stage, variable)) {
        addViewVariable(app.stage, variable);
      }
    }

    for (const stock of state.items.stocks) {
      if (!updateViewStock(app.stage, stock)) {
        addViewStock(app.stage, stock);
      }
    }

    for (const link of state.items.links) {
      let startNode: Variable | Stock | undefined = undefined;
      if (isVariable(link.start)) {
        startNode = state.items.variables.find(
          (varialbe) => varialbe.name === link.start,
        );
      }
      if (isStock(link.start)) {
        startNode = state.items.stocks.find(
          (stock) => stock.name === link.start,
        );
      }

      if (startNode === undefined) {
        continue;
      }

      const endNode = state.items.variables.find(
        (variable) => variable.name === link.end,
      );

      if (endNode === undefined) {
        continue;
      }

      const startView = app.stage.children.find(
        (child) => child.name === startNode?.name,
      ) as ViewNode;

      if (startView === undefined) {
        continue;
      }

      const endView = app.stage.children.find(
        (child) => child.name === endNode?.name,
      ) as ViewNode;

      if (endView === undefined) {
        continue;
      }

      const startBounds = startView.getBounds();
      const start = getIntersection(
        startNode.xy,
        startBounds.width / scale.x,
        startBounds.height / scale.y,
        endNode.xy,
        link.mid,
      );

      const endBounds = endView.getBounds();
      const end = getIntersection(
        endNode.xy,
        endBounds.width / scale.x,
        endBounds.height / scale.y,
        startNode.xy,
        link.mid,
      );

      if (!updateViewLink(app.stage, link, start, end)) {
        addViewLink(app.stage, link, start, end);
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

      if (
        isStock(name) &&
        state.items.stocks.findIndex((stock) => stock.name === name) < 0
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

    let startNode: Variable | Stock | undefined = undefined;
    if (state.dragStart !== undefined) {
      if (isVariable(state.dragStart)) {
        startNode = state.items.variables.find(
          (variable) => variable.name === state.dragStart,
        );
      }
      if (isStock(state.dragStart)) {
        startNode = state.items.stocks.find(
          (stock) => stock.name === state.dragStart,
        );
      }
    }

    let endPoint = undefined;
    let endNode: Variable | Stock | undefined = undefined;
    if (state.dragLinkEnd !== undefined) {
      if (typeof state.dragLinkEnd === "string") {
        endNode = state.items.variables.find(
          (variable) => variable.name === state.dragLinkEnd,
        );
        if (endNode !== undefined) {
          endPoint = endNode.xy;
        }
      } else {
        endPoint = state.dragLinkEnd;
      }
    }

    const indexDragLink = app?.stage.children.findIndex(
      (child) => child.name === "dragLink",
    );

    if (startNode === undefined || endPoint === undefined) {
      if (indexDragLink >= 0) {
        app?.stage.removeChildAt(indexDragLink);
      }
      return;
    }

    const startView = app.stage.children.find(
      (child) => child.name === startNode?.name ?? "",
    ) as ViewNode;
    if (startView === undefined) {
      return;
    }
    const startBounds = startView.getBounds();
    const startPoint = getIntersection(
      startNode.xy,
      startBounds.width / scale.x,
      startBounds.height / scale.y,
      endPoint,
    );
    let end = endPoint;
    if (endNode !== undefined) {
      const endView = app.stage.children.find(
        (child) => child.name === endNode?.name ?? "",
      ) as ViewNode;
      if (endView !== undefined) {
        const endBounds = endView.getBounds();
        end = getIntersection(
          endNode.xy,
          endBounds.width / scale.x,
          endBounds.height / scale.y,
          startNode.xy,
        );
      }
    }

    const dragLink = {
      name: "dragLink",
      isPlus: true,
      isWithTimeDelay: false,
      start: "",
      end: "",
      mid: undefined,
    };
    if (indexDragLink >= 0) {
      updateViewLink(app?.stage, dragLink, startPoint, end);
      return;
    }

    if (state.dragStart === undefined) {
      return;
    }

    if (state.dragStart === state.dragLinkEnd) {
      return;
    }

    addViewLink(app?.stage, dragLink, startPoint, end);

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

      if (isStock(item.name)) {
        if (isOnStock(item, xyCanvas)) {
          return item.name;
        }
      }
    }

    return "";
  }

  return [app, setApp, itemName];
}
