"use client";

import "./Menu.css";
import { IMenu, IMenuItem } from "./lib/types";

export const Menu = ({
  itemsHidden,
  index,
  onClick,
  onItemClick,
  onMouseEnter,
  menu,
  alignRight,
}: {
  itemsHidden: boolean;
  index: number;
  onClick: (index: number) => void;
  onMouseEnter?: (index: number) => void;
  onItemClick: (index: number, itemIndex: number, item: IMenuItem) => void;
  menu: IMenu;
  alignRight?: boolean;
}) => {
  function handleMenuItemClick(
    index: number,
    itemIndex: number,
    item: IMenuItem,
  ) {
    item.handler(item.arg);
    onItemClick(index, itemIndex, item);
  }

  return (
    <div className="menu">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        className="menu-btn"
        onMouseEnter={() => {
          if (onMouseEnter) {
            onMouseEnter(index);
          }
        }}
      >
        {menu.label}
      </button>
      <div
        hidden={itemsHidden}
        className={alignRight ? "menu-options-right" : "menu-options"}
      >
        {menu.items.map((item, i) => {
          return (
            <button
              key={"menu-item-" + index + "-" + i}
              onClick={() => {
                handleMenuItemClick(index, i, item);
              }}
              disabled={!item.enabled ?? false}
              className={
                alignRight
                  ? item.enabled ?? false
                    ? "menu-item-right"
                    : "menu-item-disabled-right"
                  : item.enabled ?? false
                    ? "menu-item"
                    : "menu-item-disabled"
                //(alignRight ? "-right" : "")
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
