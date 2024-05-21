"use client";

import "./MenuBar.css";
import { useState } from "react";

import { Menu } from "./Menu";
import { IMenu, IMenuItem } from "./lib/types";
import { useLanguage } from "./lib/useLanguage";

export const MenuBar = ({ menus }: { menus: IMenu[] }) => {
  const [languages] = useLanguage();

  const [dropMenu, setDropMenu] = useState<number>(-1);

  function handleMenuClick(index: number) {
    if (dropMenu === index) {
      setDropMenu(-1);
      return;
    }
    setDropMenu(index);
  }

  function handleMenuMouseEnter(index: number) {
    if (dropMenu === -1) {
      return;
    }
    setDropMenu(index);
  }

  function handleItemClick(index: number, indexItem: number, item: IMenuItem) {
    setDropMenu(-1);
  }

  function handleMenubarClick() {
    setDropMenu(-1);
  }

  return (
    <nav className="menubar-nav">
      <div className="menubar" onClick={handleMenubarClick}>
        <div className="menubar-menu">
          {menus.map((menu, i) => {
            return (
              <Menu
                key={"menu-" + i}
                itemsHidden={dropMenu !== i}
                index={i}
                onClick={handleMenuClick}
                onItemClick={handleItemClick}
                onMouseEnter={handleMenuMouseEnter}
                menu={menu}
              />
            );
          })}
        </div>
        <Menu
          itemsHidden={dropMenu !== menus.length}
          index={menus.length}
          onClick={handleMenuClick}
          onItemClick={handleItemClick}
          onMouseEnter={handleMenuMouseEnter}
          menu={languages}
          alignRight={true}
        />
      </div>
    </nav>
  );
};
