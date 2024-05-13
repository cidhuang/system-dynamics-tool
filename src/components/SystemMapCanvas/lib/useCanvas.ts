import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Application, type ICanvas } from "pixi.js";

import { Point } from "@/components/SystemMapCanvas/lib/types";

export function useCanvas(
  offset: () => Point,
  editing: string,
): [
  Application<ICanvas> | undefined,
  Dispatch<SetStateAction<Application<ICanvas> | undefined>>,
  Point,
  () => void,
  () => void,
  (x: number, y: number) => [Point, Point],
  (xy: Point) => void,
  (xy: Point) => void,
] {
  const [app, setApp] = useState<Application<ICanvas>>();
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [movingViewportXY0, setMovingViewportXY0] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [viewportPosition, setViewportPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const handleZoomOut = (): void => {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  };

  const handleZoomIn = (): void => {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
  };

  function handleWheel(event: WheelEvent) {
    if (editing !== "") {
      return;
    }
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
    (app?.view as unknown as HTMLElement)?.addEventListener(
      "wheel",
      handleWheel,
    );

    return () => {
      (app?.view as unknown as HTMLElement)?.removeEventListener(
        "wheel",
        handleWheel,
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleWheel]);

  useEffect(() => {
    app?.stage.scale.set(scale.x, scale.y);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const XY = (x: number, y: number): [Point, Point] => {
    const canvasPosition = offset();
    const xCanvas = x + document.documentElement.scrollLeft - canvasPosition.x;
    const yCanvas = y + document.documentElement.scrollTop - canvasPosition.y;

    const xMap = (xCanvas - viewportPosition.x) / scale.x;
    const yMap = (yCanvas - viewportPosition.y) / scale.y;
    return [
      { x: xCanvas, y: yCanvas },
      { x: xMap, y: yMap },
    ];
  };

  function startMovingViewport(xyCanvas: Point) {
    setMovingViewportXY0(xyCanvas);
  }

  function moveViewport(xyCanvas: Point) {
    const position1 = {
      x: viewportPosition.x + xyCanvas.x - movingViewportXY0.x,
      y: viewportPosition.y + xyCanvas.y - movingViewportXY0.y,
    };
    app?.stage.position.set(position1.x, position1.y);
    setViewportPosition(position1);
    setMovingViewportXY0(xyCanvas);
  }

  return [
    app,
    setApp,
    viewportPosition,
    handleZoomIn,
    handleZoomOut,
    XY,
    startMovingViewport,
    moveViewport,
  ];
}
