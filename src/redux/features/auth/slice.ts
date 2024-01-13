import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USERS, UsersStateType, UserType } from "./types";

const usersInitialState: UsersStateType = {
  user: {
    data: null,
    isLoading: false,
    errors: '',
  }
}

export const userSlice = createSlice({
  name: USERS,
  initialState: usersInitialState,
  reducers: {
    /* This action will trigger our saga middleware
       and set the loader to true and reset error message.
    */
    getUserAction: (state: UsersStateType, { payload: id }: PayloadAction<string>) => {
      state.user.isLoading = true;
      state.user.errors = '';
    },
    getUserSuccessAction: (state: UsersStateType, { payload: user }: PayloadAction<UserType>) => {
      state.user.isLoading = false;
      state.user.data = user;
    },
    getUserErrorAction: (state: UsersStateType, { payload: error }: PayloadAction<string>) => {
      state.user.isLoading = false;
      state.user.errors = error;
    },
  }
})

/* getUserSuccessAction and getUserErrorAction will be used inside the saga
  middleware. Only getUserAction will be used in a React component.
*/

export const {
  getUserAction,
  getUserSuccessAction,
  getUserErrorAction,
} = userSlice.actions;
export default userSlice.reducer;