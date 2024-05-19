import {
  useEffect,
  useState,
  Dispatch,
  MutableRefObject,
  SyntheticEvent,
  SetStateAction,
} from "react";
import { Application, type ICanvas } from "pixi.js";

import { Point } from "../lib/geometry";
import { Actions } from "../reducer/reducer";

export function useMouse(
  app: Application<ICanvas> | undefined,
  ref: MutableRefObject<null>,
  selected: string,
  setSelected: Dispatch<SetStateAction<string>>,
  editingText: string,
  dispatch: Dispatch<Actions>,
  itemName: (xyCanvas: Point, xyMap: Point) => string,
  editTextStart: (item: string) => void,
  editTextEnd: () => void,
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
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });
  const [isEditable, setIsEditable] = useState<boolean>(false);

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

  const handleZoomOut = (): void => {
    setScale({ x: scale.x * 0.8, y: scale.y * 0.8 });
  };

  const handleZoomIn = (): void => {
    setScale({ x: scale.x * 1.25, y: scale.y * 1.25 });
  };

  function handleWheel(event: WheelEvent) {
    if (editingText !== "") {
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
    if (editingText !== "") {
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

    if (editingText !== "") {
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
    if (editingText !== "") {
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

    setSelected("");

    if (editingText !== "") {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

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

    if (editingText !== "") {
      editTextEnd();
      return;
    }

    if (isMouseMoved) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (selected !== item) {
      setSelected(item);
      setIsEditable(false);
      setTimeout(() => {
        setIsEditable(true);
      }, 1000);
      return;
    }

    if (selected === item) {
      if (!isEditable) {
        return;
      }
      editTextStart(item);
      setSelected(item);
    }

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

    if (e.changedTouches.length < 1) {
      return;
    }

    handleDown(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  function handleTouchMove(event: SyntheticEvent) {
    const e = event as unknown as TouchEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.changedTouches.length < 1) {
      return;
    }

    handleMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  function handleTouchUp(event: SyntheticEvent) {
    const e = event as unknown as TouchEvent;
    e.stopPropagation();
    //console.log(e);

    setIsTouched(true);
    setIsMouseMoved(false);

    if (e.changedTouches.length < 1) {
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
