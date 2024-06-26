import {
  SmoothGraphics as Graphics,
  DashLineShader,
} from "@pixi/graphics-smooth";
// import { Graphics } from 'pixi.js';
import { Polygon, type ColorSource } from "pixi.js";
import { Point, getArc } from "../geometry";

export class ViewEdge extends Graphics {
  protected _start: Point;
  protected _end: Point;
  protected _mid: Point | undefined;

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
    if (this._mid === undefined && mid === undefined) {
      return;
    }

    if (this._mid !== undefined && mid !== undefined) {
      if (this._mid.x === mid.x && this._mid.y === mid.y) {
        return;
      }
    }

    this._mid = mid;
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
          const width = 20;
          const dx = Math.cos(angle) * width;
          const dy = Math.sin(angle) * width;

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

  protected _polygon: Polygon | undefined = undefined;

  constructor(start: Point, end: Point);
  constructor(start: Point, end: Point, mid: Point, isPolyline?: boolean);
  constructor(start: Point, end: Point, mid?: Point, isPolyline?: boolean) {
    super();

    this._start = start;
    this._end = end;
    this._mid = mid;

    if (isPolyline === undefined) {
      this._isPolyline = false;
    } else {
      this._isPolyline = isPolyline;
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
      if (this._mid !== undefined) {
        this.lineTo(this._mid.x, this._mid.y);
      }
      this.lineTo(this._end.x, this._end.y);
      if (this._mid !== undefined) {
        arrowDirectionAngle = Math.atan2(
          this._end.y - this._mid.y,
          this._end.x - this._mid.x,
        );
      } else {
        arrowDirectionAngle = Math.atan2(
          this._end.y - this._start.y,
          this._end.x - this._start.x,
        );
      }
    } else {
      const arc = getArc(this._start, this._end, this._mid);

      if (arc !== undefined) {
        this.arc(
          arc.center.x,
          arc.center.y,
          arc.radius,
          arc.startAngle,
          arc.endAngle,
          arc.anticlockwise,
        );
        if (arc.anticlockwise) {
          arrowDirectionAngle = arc.endAngle - Math.PI / 2;
        } else {
          arrowDirectionAngle = arc.endAngle + Math.PI / 2;
        }
      } else {
        this.moveTo(this._start.x, this._start.y);
        this.lineTo(this._end.x, this._end.y);
        arrowDirectionAngle = Math.atan2(
          this._end.y - this._start.y,
          this._end.x - this._start.x,
        );
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
