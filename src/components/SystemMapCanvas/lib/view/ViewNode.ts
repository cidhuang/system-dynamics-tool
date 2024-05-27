import { Container, Graphics, Text, Rectangle } from "pixi.js";

import { Point } from "../geometry";

export class ViewNode extends Container {
  protected _background: Graphics;
  protected _text: Text;

  protected _isHover: boolean = false;
  protected _isSelected: boolean = false;

  get text() {
    return this._text.text;
  }
  set text(text: string) {
    this._text.text = text;
    this._text.x = -this._text.width / 2;
    this._text.y = -this._text.height / 2;
  }

  get isHover() {
    return this._isHover;
  }
  set isHover(isHover: boolean) {
    if (this._isHover === isHover) {
      return;
    }

    this._isHover = isHover;
  }

  get isSelected() {
    return this._isSelected;
  }
  set isSelected(isSelected: boolean) {
    if (this._isSelected === isSelected) {
      return;
    }

    this._isSelected = isSelected;
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
    this._text.x = -this._text.width / 2;
    this._text.y = -this._text.height / 2;

    this._text.name = "text";
    this._text.style.align = "center";
    this._text.style.fill = "black";
    this._text.style.fontWeight = "normal";

    this.addChild(this._background);
    this.addChild(this._text);
  }
}
