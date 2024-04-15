'use client'

import { useTranslation } from "next-export-i18n"

interface MenuItem {
  label: string,
  handler: (arg: any) => void
  arg: any,
}

export default function Menu(
  {
    index,
    hidden,
    onClick,
    label,
    items
  }: {
    index: number,
    hidden: boolean,
    onClick: (index: number, hidden: boolean) => void,
    label: string,
    items: MenuItem[]
  }
) {
  const { t } = useTranslation();

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => { onClick(index, !hidden) }} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500">
        {t(label)}
      </button>
      <div hidden={hidden} className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2">
        {items.map((item, i) => {
          return (
            <button key={"menu-item-" + i} onClick={() => { item.handler(item.arg); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              {t(item.label)}
            </button>
          )
        })}
      </div >
    </div >
  )
}
