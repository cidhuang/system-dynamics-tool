import { useEffect, useState } from "react";
import { Application, type ICanvas } from "pixi.js";

import { Point } from "@/components/SystemMapCanvas/lib/types";

export function useApp(): [
  Application<ICanvas> | undefined,
  any,
  Point,
  Point,
  () => void,
  () => void,
] {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const handleZoomOut = (): void => {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  };

  const handleZoomIn = (): void => {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.view]);

  useEffect(() => {
    app?.stage.scale.set(scale.x, scale.y);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  return [app, setApp, offset, scale, handleZoomIn, handleZoomOut];
}
