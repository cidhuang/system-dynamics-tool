export interface IMenuItem {
  label: string;
  handler: (arg: any) => void;
  arg: any;
}

export interface IMenu {
  label: string;
  items: IMenuItem[];
}
