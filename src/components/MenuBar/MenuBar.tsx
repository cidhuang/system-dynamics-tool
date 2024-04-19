"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import i18n from "../../../i18n/index";

import { Menu, IMenu, IMenuItem } from "./Menu";

export const MenuBar = ({ menus }: { menus: IMenu[] }) => {
  function handlerLangItem(arg: any) {
    const tmp = new URLSearchParams(searchParams);
    tmp.set("lang", arg);
    router.push(pathname + "?" + tmp.toString());
  }

  const menuLang = {
    label: "__language__",
    items: Object.keys(i18n.translations).map((key, i) => {
      return {
        label:
          i18n.translations[key as unknown as keyof typeof i18n.translations][
            "__language__"
          ],
        handler: handlerLangItem,
        arg: key,
      };
    }),
  };

  const [dropMenu, setDropMenu] = useState<number>(-1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleMenuClick(index: number) {
    if (dropMenu === index) {
      setDropMenu(-1);
      return;
    }
    setDropMenu(index);
  }

  function handleItemClick(index: number, indexItem: number, item: IMenuItem) {
    setDropMenu(-1);
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {menus.map((menu, i) => {
            return (
              <Menu
                key={"menu-" + i}
                itemsHidden={dropMenu !== i}
                index={i}
                onClick={handleMenuClick}
                onItemClick={handleItemClick}
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
          menu={menuLang}
        />
      </div>
    </nav>
  );
};
