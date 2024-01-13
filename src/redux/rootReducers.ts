import { UsersStateType } from "./features/users/types";
import userSlice from "./features/users/userSlice";

export type StateType = {
  // Reducers types here  
  users: UsersStateType;
};

const rootReducers = {
  // Reducers here  
  users: userSlice
};

export default rootReducers;