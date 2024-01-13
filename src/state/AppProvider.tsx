/**
 * AppProvider.tsx
 */

import authReducer, { defaultState } from "auth-context/reducer";
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { INIT_STORED } from "./ActionTypes";
import {
  IDataInit,
  ILoading,
  IState,
  IThemeAction,
  StateActions,
} from "./interfaces";
import { TeethActions } from "./interfaces/teeth.interface";
import { UserActions } from "./interfaces/user.interface";
import appStateReducer from "./reducers/appStateReducer";
import teethReducer from "./reducers/teethReducer";
import userReducer from "./reducers/userReducer";
//  import themeReducer from "./reducers/themeReducer";
export const APP_STATE_NAME = "testing";

//Check if state already exist and take the instance or set a default value
//in case there is no state in the localstorage

// **NOTES** NGHIA:localStorage is not defined on the server side
// You'll have to wait until the browser renders it in order to use localStorage
const initialState: IState = {
  authState: defaultState,
  user: {
    name: "",
    userId: "",
    username: "",
    active: false,
  },
  teeth: {
    userId: undefined,
    stepsData: undefined,
    currentStep: -1,
    maxi: true,
    mand: true,
    isSuper: false,
    upperAction: false,
    selectedTooth: undefined,
    clinicCode: "",
  },
  loading: false,
};

const AppContext = createContext<{
  state: IState;
  dispatch: Dispatch<StateActions>;
}>({ state: initialState, dispatch: () => null });

const combinedReducers = (
  state: IState,
  action: UserActions | IThemeAction | TeethActions | IDataInit | ILoading
) => ({
  ...appStateReducer(state, action),
  authState: authReducer(state.authState, action),
  user: userReducer(state.user, action),
  teeth: teethReducer(state.teeth, action),
  // loading: false,

  //  theme: themeReducer(theme, action),
});

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);
  // Watches for any changes in the state and keeps the state update in sync
  //Refresh state on any action dispatched
  useEffect(() => {
    // localStorage.getItem(APP_STATE_NAME);
    // // console.log('[First] Get State::\n', state)
    if (JSON.parse(localStorage.getItem(APP_STATE_NAME)!)) {
      const storedData = JSON.parse(localStorage.getItem(APP_STATE_NAME)!);
      storedData.teeth.currentStep = -1;

      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      // console.log('CIQUAN=====\n\n', storedData)

      // dispatch({
      //   type: INIT_STORED,
      //   payload: storedData,
      // });
    }
  }, []);

  useEffect(() => {
    //Update the localstorage after detected change
    // if(state !== initialState)
    //localStorage.setItem(APP_STATE_NAME, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = () => useContext(AppContext);

export default AppProvider;
export { AppContext, AppProvider };
