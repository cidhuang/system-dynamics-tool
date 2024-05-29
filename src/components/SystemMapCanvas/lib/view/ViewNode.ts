import { Container, Graphics, Text, Rectangle } from "pixi.js";

import { Point } from "../geometry";

export enum EBackgroundShape {
  None,
  Rectangle,
  Circle,
}

export class ViewNode extends Container {
  protected _background: Graphics;
  protected _text: Text;

  protected _backgroundShape: EBackgroundShape = EBackgroundShape.None;

  protected _isHover: boolean = false;
  protected _isSelected: boolean = false;

  get text() {
    return this._text.text;
  }
  set text(text: string) {
    if (this._text.text === text) {
      return;
    }

    this._text.text = text;
    this.update();
  }

  set backgroundShape(shape: EBackgroundShape) {
    if (this._backgroundShape === shape) {
      return;
    }

    this._backgroundShape = shape;
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
    const bounds = this._text.getBounds();

    if (
      x >= bounds.left &&
      x <= bounds.right &&
      y >= bounds.top &&
      y <= bounds.bottom
    ) {
      return true;
    }

    return false;
  }

  public getBounds(): Rectangle {
    return this._text.getBounds();
  }

  constructor(xy: Point, text?: string) {
    super();

    this.x = xy.x;
    this.y = xy.y;

    this._background = new Graphics();
    this._background.name = "background";

    this._text = new Text(text);
    this._text.name = "text";
    this._text.style.align = "center";

    this.addChild(this._background);
    this.addChild(this._text);

    this.update();
  }

  protected update(isHover: boolean = false) {
    this._text.x = -this._text.width / 2;
    this._text.y = -this._text.height / 2;

    this._text.style.fill = "black";
    this._text.style.fontWeight = "normal";

    if (this._backgroundShape === EBackgroundShape.None) {
      this._background.clear();
    } else if (this._backgroundShape === EBackgroundShape.Rectangle) {
      this._background.lineStyle({ width: 2, color: "black" });
      const padding = 10;
      this._background.moveTo(0, 0);
      this._background.lineTo(this._text.width + padding * 2, 0);
      this._background.lineTo(
        this._text.width + padding * 2,
        this._text.height + padding * 2,
      );
      this._background.lineTo(0, this._text.height + padding * 2);
      this._background.lineTo(0, 0);
      this._background.x = this._text.x - padding;
      this._background.y = this._text.y - padding;
    }
  }
}
