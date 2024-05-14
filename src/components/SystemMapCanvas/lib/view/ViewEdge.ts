import {
  SmoothGraphics as Graphics,
  DashLineShader,
} from "@pixi/graphics-smooth";
// import { Graphics } from 'pixi.js';
import { Polygon, type ColorSource } from "pixi.js";
import { Point } from "../types";

import { EOrientation, getOrientation, getCircle } from "../circle";

export class ViewEdge extends Graphics {
  protected _start: Point;
  protected _end: Point;
  protected _mid: Point;

  protected _color: ColorSource = 0;
  protected _width: number = 2;
  protected _arrowHeadLength: number = 0;
  protected _isDashed: boolean = false;
  protected _isPolyline: boolean = false;

  protected _isHover: boolean = false;
  protected _isSelected: boolean = false;

  get start() {
    return this._start;
  }
  set start(start: Point) {
    if (this._start.x === start.x && this._start.y === start.y) {
      return;
    }

    this._start = start;
    this.update();
  }

  get end() {
    return this._end;
  }
  set end(end: Point) {
    if (this._end.x === end.x && this._end.y === end.y) {
      return;
    }

    this._end = end;
    this.update();
  }

  get mid() {
    return this._mid;
  }
  set mid(mid: Point | undefined) {
    let x = mid?.x ?? (this._start.x + this._end.x) / 2;
    let y = mid?.y ?? (this._start.y + this._end.y) / 2;
    if (this._mid.x === x && this._mid.y === y) {
      return;
    }

    this._mid = { x, y };
    this.update();
  }

  get color() {
    return this._color;
  }
  set color(color: ColorSource) {
    if (this._color === color) {
      return;
    }

    this._color = color;
    this.update();
  }

  get width() {
    return this._width;
  }
  set width(width: number) {
    if (this._width === width) {
      return;
    }

    this._width = width;
    this.update();
  }

  get arrowHeadLength() {
    return this._arrowHeadLength;
  }
  set arrowHeadLength(arrowHeadLength: number) {
    if (this._arrowHeadLength === arrowHeadLength) {
      return;
    }

    this._arrowHeadLength = arrowHeadLength;
    this.update();
  }

  get isDashed() {
    return this._isDashed;
  }
  set isDashed(isDashed: boolean) {
    if (this._isDashed === isDashed) {
      return;
    }

    this._isDashed = isDashed;
    this.update();
  }

  get isPolyline() {
    return this._isPolyline;
  }
  set isPolyline(isPolyline: boolean) {
    if (this._isPolyline === isPolyline) {
      return;
    }

    this._isPolyline = isPolyline;
    this.update();
  }

  get isHover() {
    return this._isHover;
  }
  set isHover(isHover: boolean) {
    if (this._isHover === isHover) {
      return;
    }

    this._isHover = isHover;
    this.update(true);
  }

  get isSelected() {
    return this._isSelected;
  }
  set isSelected(isSelected: boolean) {
    if (this._isSelected === isSelected) {
      return;
    }

    this._isSelected = isSelected;
    this.update(true);
  }

  public contains(x: number, y: number): boolean {
    if (this._polygon === undefined) {
      const od: { x: number; y: number }[] = [];
      const even: { x: number; y: number }[] = [];

      let count = this.geometry.graphicsData.length;
      if (this._arrowHeadLength > 0) {
        count -= 1;
      }

      for (let i = 0; i < count; i += 1) {
        const { points } = this.geometry.graphicsData[i];
        for (let index = 0; index < points.length - 2; index += 2) {
          const x1 = points[index];
          const y1 = points[index + 1];
          const x2 = points[index + 2];
          const y2 = points[index + 3];

          const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
          const dx = this._width * Math.cos(angle);
          const dy = this._width * Math.sin(angle);

          od.push({
            x: x1 - dx,
            y: y1 - dy,
          });
          od.push({
            x: x2 - dx,
            y: y2 - dy,
          });
          even.push({
            x: x1 + dx,
            y: y1 + dy,
          });
          even.push({
            x: x2 + dx,
            y: y2 + dy,
          });
        }
      }

      const tmp = [...od, ...even.reverse()];
      this._polygon = tmp.length === 0 ? undefined : new Polygon(tmp);
    }

    return this._polygon?.contains(x, y) ?? false;
  }

  protected _orientation: EOrientation = EOrientation.Collinear;

  protected _center: Point = { x: 0, y: 0 };
  protected _radius: number = Infinity;
  protected _startAngle: number = 0;
  protected _endAngle: number = 0;

  protected _polygon: Polygon | undefined = undefined;

  constructor(start: Point, end: Point);
  constructor(start: Point, end: Point, mid: Point, isPolyline?: boolean);
  constructor(start: Point, end: Point, mid?: Point, isPolyline?: boolean) {
    super();

    this._start = start;
    this._end = end;

    if (isPolyline === undefined) {
      this._isPolyline = false;
    } else {
      this._isPolyline = isPolyline;
    }

    if (mid === undefined) {
      this._mid = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };
    } else {
      this._mid = mid;
    }

    this.update();
  }

  protected update(isHover: boolean = false) {
    const width1 = this._isSelected ? this._width + 2 : this._width;
    this.clear();

    if (this._isDashed) {
      const shader = new DashLineShader({ dash: 8, gap: 5 });
      this.lineStyle({ width: width1, color: this._color, shader });
    } else {
      this.lineStyle({ width: width1, color: this._color });
    }

    let arrowDirectionAngle = 0;
    if (this._isPolyline) {
      this.moveTo(this._start.x, this._start.y);
      this.lineTo(this._mid.x, this._mid.y);
      this.lineTo(this._end.x, this._end.y);
      arrowDirectionAngle = Math.atan2(
        this._end.y - this._mid.y,
        this._end.x - this._mid.x,
      );
    } else {
      this._orientation = getOrientation(this._start, this._mid, this._end);

      if (this._orientation === EOrientation.Collinear) {
        this.moveTo(this._start.x, this._start.y);
        this.lineTo(this._end.x, this._end.y);
      } else {
        const circle = getCircle(this._start, this._mid, this._end);

        this._center = circle.center;
        this._radius = circle.radius;
        this._startAngle = Math.atan2(
          this._start.y - this._center.y,
          this._start.x - this._center.x,
        );
        this._endAngle = Math.atan2(
          this._end.y - this._center.y,
          this._end.x - this._center.x,
        );

        this.arc(
          this._center.x,
          this._center.y,
          this._radius,
          this._startAngle,
          this._endAngle,
          this._orientation === EOrientation.Counterclockwise,
        );
      }

      switch (this._orientation) {
        case EOrientation.Collinear:
          arrowDirectionAngle = Math.atan2(
            this._end.y - this._start.y,
            this._end.x - this._start.x,
          );
          break;
        case EOrientation.Clockwise:
          arrowDirectionAngle = this._endAngle + Math.PI / 2;
          break;
        case EOrientation.Counterclockwise:
          arrowDirectionAngle = this._endAngle - Math.PI / 2;
          break;
        default:
          break;
      }
    }

    if (this._arrowHeadLength > 0) {
      const angle1 = arrowDirectionAngle - Math.PI / 6;
      const angle2 = arrowDirectionAngle + Math.PI / 6;
      const headP1 = {
        x: this._end.x - this._arrowHeadLength * Math.cos(angle1),
        y: this._end.y - this._arrowHeadLength * Math.sin(angle1),
      };
      const headP2 = {
        x: this._end.x - this._arrowHeadLength * Math.cos(angle2),
        y: this._end.y - this._arrowHeadLength * Math.sin(angle2),
      };

      this.lineStyle({ width: width1, color: this._color });
      this.moveTo(headP1.x, headP1.y);
      this.lineTo(this._end.x, this._end.y);
      this.lineTo(headP2.x, headP2.y);
    }

    if (!isHover) {
      this._polygon = undefined;
    }
  }
}
