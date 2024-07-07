import { Container, Graphics, ColorSource } from "pixi.js";
import { ViewEdge } from "./ViewEdge";

import { Point, getArc, toDegree } from "../geometry";

export class ViewLink extends Container {
  protected _edge: ViewEdge;
  protected _timeDelay: Graphics;

  protected _isWithTimeDelay: boolean = false;

  get start() {
    return this._edge.start;
  }
  set start(start: Point) {
    this._edge.start = start;

    this.update();
  }

  get end() {
    return this._edge.end;
  }
  set end(end: Point) {
    this._edge.end = end;

    this.update();
  }

  get mid(): Point | undefined {
    return this._edge.mid;
  }
  set mid(mid: Point | undefined) {
    this._edge.mid = mid;

    this.update();
  }

  get color() {
    return this._edge.color;
  }
  set color(color: ColorSource) {
    this._edge.color = color;

    this.update();
  }

  get width() {
    return this._edge.width;
  }
  set width(width: number) {
    this._edge.width = width;

    this.update();
  }

  get arrowHeadLength() {
    return this._edge.arrowHeadLength;
  }
  set arrowHeadLength(arrowHeadLength: number) {
    this._edge.arrowHeadLength = arrowHeadLength;
  }

  get isDashed() {
    return this._edge.isDashed;
  }
  set isDashed(isDashed: boolean) {
    this._edge.isDashed = isDashed;
  }

  get isWithTimeDelay() {
    return this._isWithTimeDelay;
  }
  set isWithTimeDelay(isWithTimeDelay: boolean) {
    if (this._isWithTimeDelay === isWithTimeDelay) {
      return;
    }

    this._isWithTimeDelay = isWithTimeDelay;

    this.update();
  }

  protected update() {
    this._timeDelay.clear();

    if (!this._isWithTimeDelay) {
      return;
    }

    const center =
      this._edge.mid === undefined
        ? {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2,
          }
        : this._edge.mid;

    const arc = getArc(this.start, this.end, this.mid);

    const angle =
      arc === undefined
        ? Math.atan2(this.start.y - this.end.y, this.start.x - this.end.x) +
          Math.PI / 2
        : Math.atan2(arc.center.y - center.y, arc.center.x - center.x);

    this._timeDelay.lineStyle({ width: this.width * 3, color: "white" });

    this._timeDelay.moveTo(
      center.x - Math.cos(angle) * this.width,
      center.y - Math.sin(angle) * this.width,
    );
    this._timeDelay.lineTo(
      center.x + Math.cos(angle) * this.width,
      center.y + Math.sin(angle) * this.width,
    );

    this._timeDelay.lineStyle({ width: this.width, color: this.color });

    const radius = Math.sqrt(12);

    this._timeDelay.moveTo(
      center.x - Math.cos(angle - Math.PI / 6) * this.width * radius,
      center.y - Math.sin(angle - Math.PI / 6) * this.width * radius,
    );
    this._timeDelay.lineTo(
      center.x - Math.cos(angle - (Math.PI / 6) * 5) * this.width * radius,
      center.y - Math.sin(angle - (Math.PI / 6) * 5) * this.width * radius,
    );

    this._timeDelay.moveTo(
      center.x - Math.cos(angle - (Math.PI / 6) * 7) * this.width * radius,
      center.y - Math.sin(angle - (Math.PI / 6) * 7) * this.width * radius,
    );
    this._timeDelay.lineTo(
      center.x - Math.cos(angle - (Math.PI / 6) * 11) * this.width * radius,
      center.y - Math.sin(angle - (Math.PI / 6) * 11) * this.width * radius,
    );
  }

  public contains(x: number, y: number): boolean {
    return this._edge.contains(x, y);
  }

  //constructor(start: Point, end: Point);
  constructor(start: Point, end: Point, mid?: Point) {
    super();

    if (mid === undefined) {
      this._edge = new ViewEdge(start, end);
    } else {
      this._edge = new ViewEdge(start, end, mid);
    }
    this._edge.name = "edge";

    this._timeDelay = new Graphics();
    this._timeDelay.name = "timeDelay";

    this.addChild(this._edge);
    this.addChild(this._timeDelay);
  }
}
