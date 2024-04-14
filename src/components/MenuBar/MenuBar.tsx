
import Menu from './Menu'
import { useState } from "react"

export default function MenuBar() {

  const menus = [
    {
      hidden: true,
      label: "File",
      items: [
        {
          label: "New"
        },
        {
          label: "Save"
        },
        {
          label: "Load"
        },
        {
          label: "Save As ..."
        },
      ]
    },
    {
      hidden: true,
      label: "Edit",
      items: [
        {
          label: "Undo"
        },
        {
          label: "Redo"
        }
      ]
    },
    {
      hidden: true,
      label: "Tool",
      items: [
        {
          label: "Find Loops"
        },
        {
          label: "Find Archetypes"
        },
        {
          label: "Auto Position"
        }
      ]
    },
  ]

  const [shows, setShows] = useState<boolean[]>(menus.map(() => {return false;}));

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
      </div>
    </nav>
  );
}

