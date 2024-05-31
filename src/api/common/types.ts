export interface IUserInfo {
  name: string,
  account: string,
  menus: IMenuItem[]
}

export interface IMenuItem {
  id: string;
  icon?: string;
  name: string;
  path: string;
  component?: string;
  visiable: boolean;
  // fullPath: string;
  children?: IMenuItem[];
}