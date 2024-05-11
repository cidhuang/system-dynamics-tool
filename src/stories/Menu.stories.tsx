import React, { useState } from "react";

import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Menu } from "../components/MenuBar/Menu";
import { IMenuItem } from "@/components/MenuBar/lib/types";

const meta: Meta<typeof Menu> = {
  title: "MenuBar/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof Menu>;

/*
 * Example Button story with React Hooks.
 * See note below related to this example.
 */
const MenuWithHooks = () => {
  // Sets the hooks for both the label and primary props
  const [dropMenu, setDropMenu] = useState<number>(-1);

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

  function handleItem(arg: any) {}

  const menu = {
    label: "Edit",
    items: [
      {
        label: "Undo",
        handler: handleItem,
        arg: "Undo",
      },
      {
        label: "Redo",
        handler: handleItem,
        arg: "Redo",
      },
    ],
  };

  return (
    <Menu
      itemsHidden={dropMenu !== 0}
      index={0}
      onClick={handleMenuClick}
      onItemClick={handleItemClick}
      menu={menu}
    />
  );
};

function handleMenuClick(index: number) {}

function handleItemClick(index: number, indexItem: number, item: IMenuItem) {}

function handleItem(arg: any) {}

const menu = {
  label: "Edit",
  items: [
    {
      label: "Undo",
      handler: handleItem,
      arg: "Undo",
    },
    {
      label: "Redo",
      handler: handleItem,
      arg: "Redo",
    },
  ],
};

export const Usage: Story = {
  args: {
    itemsHidden: true,
    index: 0,
    menu: menu,
    onClick: handleMenuClick,
    onItemClick: handleItemClick,
  },
};

export const Interaction: Story = {
  render: () => <MenuWithHooks />,
};
