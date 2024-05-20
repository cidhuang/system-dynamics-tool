"use client";

import "./Menu.css";
import { IMenu, IMenuItem } from "./lib/types";

export const Menu = ({
  itemsHidden,
  index,
  onClick,
  onItemClick,
  menu,
  alignRight,
}: {
  itemsHidden: boolean;
  index: number;
  onClick: (index: number) => void;
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
        onClick={() => {
          onClick(index);
        }}
        className="menu-btn"
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
                item.enabled ?? false ? "menu-item" : "menu-item-disabled"
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
