import axios, { AxiosRequestConfig } from "axios";
import environment from "environment";
import { getUserFromCookies } from "utils/JWT";
import { BASE_URL } from "../common/config";

export const addDoctor = async (
  data: {
    doctor_id: string;
    name: string;
    email: string;
    phone?: string;
    clinicCode: string;
    birthday: string;
  },
  server?: { req: any; res: any }
): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  const url = `${server ? BASE_URL : ""}/api/v1/doctor/create`;
  const config: AxiosRequestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
    validateStatus: (_status) => true,
  };

  try {
    const response = await axios.post(url, data, config);
    const res = response.data;
    // console.log('WARN::', res?.message)
    return {
      data: res.data,
    };
  } catch (error: any) {
    console.error("ERR::", error?.message);
    return {
      data: undefined,
    };
  }
};

export const getDoctors = async (server?: {
  req: any;
  res: any;
}): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  const url = `${server ? BASE_URL : ""}/api/v1/doctor/all`;
  const config: AxiosRequestConfig = {
    method: "GET",
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
    // const response = await axios.get("api/v1/doctor", config);
    const res = response.data;
    return {
      data: res.data,
    };
  } catch (error) {
    console.log("ERR::", error);
    return {
      data: undefined,
    };
  }
};

export const getDoctorsByClinic = async (
  clinicCode: string,
  server?: { req: any; res: any }
): Promise<any> => {
  const user = await getUserFromCookies(server);
  const url = `${server ? BASE_URL : ""}/api/v1/doctor/clinic/${clinicCode}`;
  const accessToken = user?.tokens?.accessToken;
  const config: AxiosRequestConfig = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
    // params: {
    //   clinicCode
    // },
    validateStatus: (_status) => true,
  };

  try {
    const response = await axios.get(url, config);
    const res = response.data;
    return {
      data: res.data,
    };
  } catch (error) {
    console.log("ERR::", error);
    return {
      data: undefined,
    };
  }
};
