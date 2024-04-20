'use client'

import "./Menu.css";

export interface IMenuItem {
  label: string;
  handler: (arg: any) => void;
  arg: any;
}

export interface IMenu {
  label: string;
  items: IMenuItem[];
}

export const Menu = ({
  itemsHidden,
  index,
  onClick,
  onItemClick,
  menu,
}: {
  itemsHidden: boolean;
  index: number;
  onClick: (index: number) => void;
  onItemClick: (index: number, itemIndex: number, item: IMenuItem) => void;
  menu: IMenu;
}) => {
  function handleMenuItemClick(
    index: number,
    itemIndex: number,
    item: IMenuItem
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
      <div hidden={itemsHidden} className="menu-options">
        {menu.items.map((item, i) => {
          return (
            <button
              key={"menu-item-" + index + "-" + i}
              onClick={() => {
                handleMenuItemClick(index, i, item);
              }}
              className="menu-item"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
