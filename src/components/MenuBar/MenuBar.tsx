"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "next-export-i18n";

import i18n from "../../../i18n/index";

export default function MenuBar() {
  function handlerMenuItem(arg: any) {
    console.log("handlerMenuItem", arg);
  }

  const menus = [
    {
      hidden: true,
      label: "File",
      items: [
        {
          label: "New",
          handler: handlerMenuItem,
          arg: "New",
        },
        {
          label: "Save",
          handler: handlerMenuItem,
          arg: "Save",
        },
        {
          label: "Load",
          handler: handlerMenuItem,
          arg: "Load",
        },
        {
          label: "Save As",
          handler: handlerMenuItem,
          arg: "Save As",
        },
      ],
    },
    {
      hidden: true,
      label: "Edit",
      items: [
        {
          label: "Undo",
          handler: handlerMenuItem,
          arg: "Undo",
        },
        {
          label: "Redo",
          handler: handlerMenuItem,
          arg: "Redo",
        },
      ],
    },
    {
      hidden: true,
      label: "Tool",
      items: [
        {
          label: "Find Loops",
          handler: handlerMenuItem,
          arg: "Find Loops",
        },
        {
          label: "Find Archetypes",
          handler: handlerMenuItem,
          arg: "Find Archetypes",
        },
        {
          label: "Auto Position",
          handler: handlerMenuItem,
          arg: "Auto Position",
        },
      ],
    },
  ];

  const { t } = useTranslation();

  const [shows, setShows] = useState<boolean[]>(
    menus.map(() => {
      return false;
    })
  );
  const [langShow, setLangShow] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleMenuClick(index: number) {
    setShows(
      shows.map((show, i) => {
        if (i !== index) {
          return false;
        }
        return !show;
      })
    );

    setLangShow(false);
  }

  function handleMenuItemClick(index: number, item: any) {
    setShows(
      shows.map((show, i) => {
        return false;
      })
    );
    item.handler(item.arg);
  }

  function handleLanguagClick() {
    setShows(
      shows.map((show, i) => {
        return false;
      })
    );
    setLangShow(!langShow);
  }

  function handleLanguageItemClick(lang: string) {
    const tmp = new URLSearchParams(searchParams);
    tmp.set("lang", lang);
    router.push(pathname + "?" + tmp.toString());
    setLangShow(false);
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {menus.map((menu, i) => {
            return (
              <div
                key={"menu-" + i}
                className="relative inline-block text-left"
              >
                <button
                  onClick={() => {
                    handleMenuClick(i);
                  }}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                >
                  {t(menu.label)}
                </button>
                <div
                  hidden={!shows[i]}
                  className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2"
                >
                  {menu.items.map((item, i) => {
                    return (
                      <button
                        key={"menu-item-" + i}
                        onClick={() => {
                          handleMenuItemClick(i, item);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        {t(item.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="relative inline-block text-left">
            <button
              onClick={() => {
                handleLanguagClick();
              }}
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              {t("__language__")}
            </button>
            <div
              hidden={!langShow}
              className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2"
            >
              {Object.keys(i18n.translations).map((key, i) => {
                return (
                  <button
                    key={"lang-" + key}
                    onClick={() => {
                      handleLanguageItemClick(key);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {
                      i18n.translations[
                        key as unknown as keyof typeof i18n.translations
                      ]["__language__"]
                    }
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
