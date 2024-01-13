import { IUser } from "state/interfaces/user.interface";
import { LOGIN, LOGOUT } from "../ActionTypes";
import { StateActions } from "../interfaces";

const userReducer = (user: IUser, action: StateActions) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return { ...user, ...payload };
    case LOGOUT:
      return { ...user, username: "", active: false };
    // case SET_USER:
    //   return { ...user,...payload};
    default:
      return user;
  }
};
export default userReducer;
