/**
 * interfaces.ts
 */
import { AuthState } from "auth-context/reducer";
import { INIT_STORED, LOGIN, LOGOUT, SET_LOADING, THEME } from "../ActionTypes";
import {
  IMandibularToggle,
  IMaxillaryToggle,
  ITeeth,
  TeethActions,
} from "./teeth.interface";
import { IUser, UserActions } from "./user.interface";

export interface ITheme {
  dark: boolean;
}

// for action
export interface IState {
  authState: AuthState;
  user: IUser;
  teeth: ITeeth;
  loading: boolean;
  //  theme: ITheme;
}

export interface IDataInit {
  type: typeof INIT_STORED;
  payload: IState;
}

export interface ILoading {
  type: typeof SET_LOADING;
  payload: {
    loading: boolean;
  };
}

//
export interface IThemeAction {
  type: typeof THEME;
  payload: { toggle: boolean };
}

//  export type TeethActions = IMaxillaryToggle | IMandibularToggle;
export type StateActions =
  | IThemeAction
  | TeethActions
  | UserActions
  | IDataInit
  | ILoading;
