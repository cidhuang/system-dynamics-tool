import {
  useEffect,
  useState,
  Dispatch,
  MutableRefObject,
  SyntheticEvent,
  SetStateAction,
} from "react";
import { Application, type ICanvas } from "pixi.js";

import { Point, getDistance } from "../lib/geometry";
import { Actions } from "../reducer/reducer";
import { IStateCanvas } from "../reducer/types";
import { isStock, isVariable } from "../lib/types";

export function useInteraction(
  app: Application<ICanvas> | undefined,
  ref: MutableRefObject<null>,
  state: IStateCanvas,
  scale: Point,
  setScale: Dispatch<SetStateAction<Point>>,
  setSelected: Dispatch<SetStateAction<string>>,
  editingTextNode: string,
  dispatch: Dispatch<Actions>,
  itemName: (xyCanvas: Point, xyMap: Point) => string,
  editTextStart: (item: string) => void,
): [
  () => void,
  () => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
] {
  const [isMouseMoved, setIsMouseMoved] = useState<boolean>(false);
  const [isMovingViewport, setIsMovingViewport] = useState<boolean>(false);
  const [isMovingViewportXY0, setIsMovingViewportXY0] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [viewportPosition, setViewportPosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [pinchPoints, setPinchPoints] = useState<[Point, Point]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const handleZoomOut = (): void => {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  };

  const handleZoomIn = (): void => {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
  };

  function handleWheel(event: WheelEvent) {
    if (editingTextNode !== "") {
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
    const xCanvas =
      x +
      document.documentElement.scrollLeft -
      (ref.current as unknown as HTMLElement).offsetLeft;
    const yCanvas =
      y +
      document.documentElement.scrollTop -
      (ref.current as unknown as HTMLElement).offsetTop;

    const xMap = (xCanvas - viewportPosition.x) / scale.x;
    const yMap = (yCanvas - viewportPosition.y) / scale.y;
    return [
      { x: xCanvas, y: yCanvas },
      { x: xMap, y: yMap },
    ];
  };

  function startMovingViewport(xyCanvas: Point) {
    setIsMovingViewportXY0(xyCanvas);
  }

  function moveViewport(xyCanvas: Point) {
    const position1 = {
      x: viewportPosition.x + xyCanvas.x - isMovingViewportXY0.x,
      y: viewportPosition.y + xyCanvas.y - isMovingViewportXY0.y,
    };
    app?.stage.position.set(position1.x, position1.y);
    setViewportPosition(position1);
    setIsMovingViewportXY0(xyCanvas);
  }

  function handleDown(x: number, y: number) {
    if (editingTextNode !== "") {
      return;
    }

    const [xyCanvas, xyMap] = XY(x, y);
    const item = itemName(xyCanvas, xyMap);

    if (item === "") {
      setIsMovingViewport(true);
      startMovingViewport(xyCanvas);
      return;
    }

    dispatch({ type: "MouseLeftDown", xy: xyMap, item: item });
  }

  function handleMove(x: number, y: number) {
    setSelected("");

    if (editingTextNode !== "") {
      return;
    }

    const [xyCanvas, xyMap] = XY(x, y);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      moveViewport(xyCanvas);
      return;
    }

    dispatch({ type: "MouseMove", xy: xyMap, item: item });
  }

  function handleUp(x: number, y: number) {
    if (editingTextNode !== "") {
      return;
    }

    const [xyCanvas, xyMap] = XY(x, y);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      setIsMovingViewport(false);
      return;
    }

    dispatch({ type: "MouseLeftUp", xy: xyMap, item: item });
  }

  function handleMouseDown(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    if (isTouched) {
      return;
    }

    setIsMouseMoved(false);
    handleDown(e.clientX, e.clientY);
  }

  function handleMouseMove(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    if (isTouched) {
      return;
    }

    setIsMouseMoved(true);
    handleMove(e.clientX, e.clientY);
  }

  function handleMouseUp(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    if (isTouched) {
      return;
    }

    handleUp(e.clientX, e.clientY);
  }

  function handleDoubleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    if (editingTextNode !== "") {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (!state.modes.doubleClickToDeleteItem) {
      if (isVariable(item) || isStock(item)) {
        editTextStart(item);
        return;
      }
    }

    dispatch({
      type: "MouseLeftDoubleClick",
      xy: xyMap,
      item: item,
    });
  }

  function handleClick(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    setIsTouched(false);

    if (e.button !== 0) {
      return;
    }

    if (editingTextNode !== "") {
      return;
    }

    if (isMouseMoved) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    setSelected(item);

    //dispatch({ type: "MouseLeftClick", xy: xyMap, item: "" });
  }

  function handleContextMenu(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    e.preventDefault();
  }

  function handleTouchStart(event: SyntheticEvent) {
    const e = event as unknown as TouchEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.targetTouches.length < 1) {
      return;
    }

    if (e.targetTouches.length >= 2) {
      setPinchPoints([
        { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY },
        { x: e.targetTouches[1].clientX, y: e.targetTouches[1].clientY },
      ]);
      return;
    }

    handleDown(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  }

  function handleTouchMove(event: SyntheticEvent) {
    const e = event as unknown as TouchEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.targetTouches.length < 1) {
      return;
    }

    if (e.targetTouches.length >= 2) {
      const p0: Point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientX,
      };
      const p1: Point = {
        x: e.targetTouches[1].clientX,
        y: e.targetTouches[1].clientX,
      };
      const d0 = getDistance(pinchPoints[0], pinchPoints[1]);
      const d1 = getDistance(p0, p1);

      const delta = 50;
      if (d1 > d0 + delta) {
        setPinchPoints([p0, p1]);
        handleZoomIn();
      }
      if (d1 < d0 - delta) {
        setPinchPoints([p0, p1]);
        handleZoomOut();
      }
      return;
    }

    handleMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  }

  function handleTouchUp(event: SyntheticEvent) {
    const e = event as unknown as TouchEvent;
    e.stopPropagation();
    //console.log(e);

    setIsTouched(true);
    setIsMouseMoved(false);

    if (e.targetTouches.length > 1) {
      return;
    }

    handleUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  return [
    handleZoomIn,
    handleZoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    handleClick,
    handleContextMenu,
    handleTouchStart,
    handleTouchMove,
    handleTouchUp,
  ];
}
