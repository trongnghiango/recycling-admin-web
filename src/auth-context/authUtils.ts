import { IState } from "state/interfaces";

export const validateToken = (rootState: IState) => {
  const token = rootState?.authState?.data?.tokens?.accessToken;
  if (!token) throw new Error("Please Log in");
  return token;
};
