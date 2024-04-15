'use client'

import { useState } from "react"

import Menu from './Menu'
import Language from "./Language";

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
      ]
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
        }
      ]
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
        }
      ]
    },
  ]

  const [shows, setShows] = useState<boolean[]>(menus.map(() => { return false; }));

  function handleClick(index: number) {
    setShows(shows.map((show, i) => {
      if (i !== index) {
        return false;
      }
      return !show;
    }));
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {menus.map((menu, i) => {
            return (
              <Menu key={"menu-" + i}
                index={i}
                onClick={handleClick}
                hidden={!shows[i]}
                label={menu.label}
                items={menu.items}
              />
            )
          })}
        </div>
        <div>
          <Language />
        </div>
      </div>
    </nav>
  );
}

