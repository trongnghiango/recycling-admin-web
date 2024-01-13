import { LOGIN, LOGOUT } from "state/ActionTypes";

export interface IUser {
  id?: number;
  userId: string;
  name: string;
  title?: string;
  username?: string;
  displayName?: string;
  url?: string;
  vehicles?: string[];
  email?: string;
  active?: boolean;
  created?: string;
  edited?: string;
}

//for Action
export interface IUserLogin {
  type: typeof LOGIN;
  payload: IUser;
}

export interface IUserLogout {
  type: typeof LOGOUT;
  payload: any;
}
export type UserActions = IUserLogin | IUserLogout;
