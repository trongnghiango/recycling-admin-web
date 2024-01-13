import axios, { AxiosRequestConfig } from "axios";
import { IUser } from "state/interfaces/user.interface";
import { getUserFromCookies } from "utils/JWT";
import { BASE_URL } from "../common/config";

export const refreshToken = () => {};

export const signIn = async (
  credentials: {
    email: string;
    password: string;
  },
  server?: { req: any; res: any }
): Promise<any> => {
  const url = `${server ? BASE_URL : ""}/api/v1/login/basic`;
  const config: AxiosRequestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
      "Access-Control-Allow-Origin": "*",
    },
    // params: {},

    validateStatus: (_status) => true,
  };

  try {
    const response = await axios.post(url, credentials, config);
    const res = response.data;
    return {
      data: res,
    };
  } catch (error: any) {
    console.log("[login] ERR::", error?.message);
    return {
      data: undefined,
    };
  }
};

export const getMe = async (server?: { req: any; res: any }): Promise<any> => {
  const user = getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  // console.log("Token::", user);
  const url = `${server ? BASE_URL : ""}/api/v1/profile/my`;

  const config: AxiosRequestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
    // params: {},
    validateStatus: (_status) => true,
  };
  try {
    const response = await axios.get(url, config);
    // const res = response.data;
    // console.log(">>DATA::>>", response);
    return {
      data: response.data?.data,
    };
  } catch (error: any) {
    console.warn(">>ERROR::>>", error.message);
    return {
      data: undefined,
    };
  }
};
