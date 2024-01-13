import { IUser } from "state/interfaces/user.interface";
import { INIT_STORED, LOGIN, LOGOUT, SET_LOADING } from "../ActionTypes";
import { IState, StateActions } from "../interfaces";

const appStateReducer = (appState: IState, action: StateActions) => {
  const { type, payload } = action;
  switch (type) {
    case INIT_STORED:
      return { ...appState, ...payload };

    case SET_LOADING:
      return {
        ...appState,
        loading: payload.loading,
      };

    default:
      return appState;
  }
};
export default appStateReducer;
