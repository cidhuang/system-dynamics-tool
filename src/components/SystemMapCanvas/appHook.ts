import { useEffect, useState } from "react";
import { Text, Application, type ICanvas } from "pixi.js";

import { Point } from "@/components/SystemMapCanvas/lib/types";

export function useApp(): [
  Application<ICanvas> | undefined,
  any,
  () => void,
  () => void,
  (x: number) => number,
  (y: number) => number,
] {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const handleZoomIn = (): void => {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
  };

  const handleZoomOut = (): void => {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  };

  function handleWheel(event: WheelEvent) {
    const e = event as unknown as WheelEvent;
    e.preventDefault();

    if (e.deltaY < 0) {
      handleZoomIn();
    }

    if (e.deltaY > 0) {
      handleZoomOut();
    }
  }

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    const view = app.view as unknown as HTMLElement;
    if (view === undefined || view === null) {
      return;
    }
    view.addEventListener("wheel", handleWheel);

    return () => {
      view.removeEventListener("wheel", handleWheel);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleWheel]);

  useEffect(() => {
    if (app === undefined || app === null) {
      return;
    }

    const view = app.view as unknown as HTMLElement;

    setOffset({ x: view.offsetLeft ?? 0, y: view.offsetTop ?? 0 });

    let text = new Text("Test");
    text.name = "test";
    text.style.align = "center";
    text.style.fill = "black";
    text.x = 100 - text.width / 2;
    text.y = 100 - text.height / 2;
    text.style.fill = "red";
    text.style.fontWeight = "normal";

    app.stage.addChild(text);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.view]);

  useEffect(() => {
    app?.stage.scale.set(scale.x, scale.y);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const x = (x: number): number => {
    const left = offset?.x ?? 0;
    return x - left + document.documentElement.scrollLeft;
  };

  const y = (y: number): number => {
    const top = offset?.y ?? 0;
    return y - top + document.documentElement.scrollTop;
  };

  return [app, setApp, handleZoomIn, handleZoomOut, x, y];
}
