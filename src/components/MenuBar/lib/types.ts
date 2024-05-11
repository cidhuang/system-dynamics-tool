export interface IMenuItem {
  label: string;
  handler: (arg: any) => void;
  arg: any;
  enabled?: boolean;
}

export interface IMenu {
  label: string;
  items: IMenuItem[];
}
