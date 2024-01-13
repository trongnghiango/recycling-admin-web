import { IPatient } from "./patients.constants";
import axios, { AxiosRequestConfig } from "axios";
import environment from "environment";
import { getUserFromCookies } from "utils/JWT";
import { BASE_URL } from "../common/config";

export const addPatient = async (
  data: {
    name: string;
    patient_id: string;
    email: string;
    birthday: string;
    followedByDoctor: string;
    status: string;
    start_date: string;
    treatment_option: string;
    notes: string;
  },
  server?: { req: any; res: any }
): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  const url = `${server ? BASE_URL : ""}/api/v1/patient/create`;
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
    const response = await axios.post(url, data, config);
    const res = response.data;
    return {
      data: res.data,
    };
  } catch (error: any) {
    console.log("ERR::", error);
    return {
      data: error.message,
    };
  }
};

export const getPatients = async (server?: {
  req: any;
  res: any;
}): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  const url = `${server ? BASE_URL : ""}/api/v1/patient/all`;

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
    const res = response.data;
    if (!!res && res.statusCode === "10000") {
      // console.log(">>>::", res);
      return {
        data: res.data,
      };
    }

    return {
      data: res.message,
    };
  } catch (error) {
    console.log("ERR::", error);
    return {
      data: undefined,
    };
  }
};

export const getPatient = async (
  id: string,
  server?: {
    req: any;
    res: any;
  }
): Promise<IPatient[]> => {
  const url = `${server ? BASE_URL : ""}/api/v1/patient/${id}`;
  const response = await axios.get(url);

  return response.data;
};
