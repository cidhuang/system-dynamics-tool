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
  handleEdit: (item: string) => void,
): [
  () => void,
  () => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
  (event: SyntheticEvent) => void,
] {
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });
  const [editable, setEditable] = useState<boolean>(false);

  const [moving, setMoving] = useState<boolean>(false);
  const [isMovingViewport, setIsMovingViewport] = useState<boolean>(false);

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

  function handleMouseDown(event: SyntheticEvent) {
    setMoving(false);
    if (editingText !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (item === "") {
      setIsMovingViewport(true);
      startMovingViewport(xyCanvas);
      return;
    }

    if (e.button === 0) {
      dispatch({ type: "MouseLeftDown", xy: xyMap, item: item });
    }
  }

  function handleMouseMove(event: SyntheticEvent) {
    setSelected("");

    setMoving(true);
    if (editingText !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      moveViewport(xyCanvas);
      return;
    }

    dispatch({ type: "MouseMove", xy: xyMap, item: item });
  }

  function handleMouseUp(event: SyntheticEvent) {
    if (editingText !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (isMovingViewport) {
      setIsMovingViewport(false);
      return;
    }

    dispatch({ type: "MouseLeftUp", xy: xyMap, item: item });
  }

  function handleDoubleClick(event: SyntheticEvent) {
    setSelected("");

    if (editingText !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
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
    if (moving) {
      return;
    }
    if (editingText !== "") {
      return;
    }
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    //console.log(e);

    if (e.button !== 0) {
      return;
    }

    const [xyCanvas, xyMap] = XY(e.clientX, e.clientY);
    const item = itemName(xyCanvas, xyMap);

    if (selected !== item) {
      setSelected(item);
      setEditable(false);
      setTimeout(() => {
        setEditable(true);
      }, 1000);
      return;
    }

    if (selected === item) {
      if (!editable) {
        return;
      }
      handleEdit(item);
      setSelected(item);
    }

    //dispatch({ type: "MouseLeftClick", xy: xyMap, item: "" });
  }

  function handleContextMenu(event: SyntheticEvent) {
    const e = event as unknown as MouseEvent;
    e.stopPropagation();
    e.preventDefault();
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
  ];
}
