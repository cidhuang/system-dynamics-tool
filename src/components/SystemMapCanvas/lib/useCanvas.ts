import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Application, type ICanvas } from "pixi.js";

import { Point } from "@/components/SystemMapCanvas/lib/types";

export function useCanvas(): [
  Application<ICanvas> | undefined,
  Dispatch<SetStateAction<Application<ICanvas> | undefined>>,
  () => void,
  () => void,
  (x: number, y: number) => [Point, Point],
  (xy: Point) => void,
  (xy: Point) => void,
] {
  const [app, setApp] = useState<Application<ICanvas>>();
  //const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [movingCanvasXY0, setMovingCanvasXY0] = useState<Point>({ x: 0, y: 0 });
  const [stagePosition, setStagePosition] = useState<Point>({ x: 0, y: 0 });

  function offset(): Point {
    return {
      x: (app?.view as unknown as HTMLElement)?.offsetLeft ?? 0,
      y: (app?.view as unknown as HTMLElement)?.offsetTop ?? 0,
    };
  }

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
    const leftTop = offset();

    const xCanvas = x - leftTop.x + document.documentElement.scrollLeft;
    const yCanvas = y - leftTop.y + document.documentElement.scrollTop;

    const xMap = (xCanvas - stagePosition.x) / scale.x;
    const yMap = (yCanvas - stagePosition.y) / scale.y;
    return [
      { x: xCanvas, y: yCanvas },
      { x: xMap, y: yMap },
    ];
  };

  function startMovingCanvas(xyCanvas: Point) {
    setMovingCanvasXY0(xyCanvas);
  }

  function moveCanvas(xyCanvas: Point) {
    const position1 = {
      x: stagePosition.x + xyCanvas.x - movingCanvasXY0.x,
      y: stagePosition.y + xyCanvas.y - movingCanvasXY0.y,
    };
    app?.stage.position.set(position1.x, position1.y);
    setStagePosition(position1);
    setMovingCanvasXY0(xyCanvas);
  }

  return [
    app,
    setApp,
    handleZoomIn,
    handleZoomOut,
    XY,
    startMovingCanvas,
    moveCanvas,
  ];
}
