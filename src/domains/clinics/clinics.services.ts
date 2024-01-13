import axios, { AxiosRequestConfig } from "axios";
import environment from "environment";
import { getUserFromCookies } from "utils/JWT";
import { BASE_URL } from "../common/config";

export const addClinic = async (
  data: {
    clinicCode: string;
    name: string;
    description: string;
  },
  server?: { req: any; res: any }
): Promise<any> => {
  const user = await getUserFromCookies();
  const accessToken = user?.tokens?.accessToken;
  const url = `${!!server ? BASE_URL : ""}/api/v1/clinic/create`;
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

  const body = {
    clinicCode: data.clinicCode,
    name: data.name,
    description: data.description,
  };

  try {
    const response = await axios.post(url, data, config);
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

export const getClinics = async (server?: {
  req: any;
  res: any;
}): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  // console.log("accessToken:", accessToken);

  const url = `${server ? BASE_URL : ""}/api/v1/clinic/all`;

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
    // console.log(">>>::", res);
    return {
      data: res.data,
    };
  } catch (error: any) {
    console.log("ERR::", error.message);
    return {
      data: undefined,
    };
  }
};

export const updateClinic = async (
  id: string,
  data: {
    name: string;
    description: string;
  },
  server?: { req: any; res: any }
): Promise<any> => {
  const user = await getUserFromCookies(server);
  const accessToken = user?.tokens?.accessToken;
  const url = `${!!server ? BASE_URL : ""}/api/v1/clinic/editor/${id}`;
  const config: AxiosRequestConfig = {
    method: "PUT",
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
  console.log({ url });

  try {
    const response = await axios.put(url, data, config);
    const res = response.data;
    console.log(res);
    return {
      data: res,
    };
  } catch (error) {
    console.log("ERR::", error);
    return {
      data: undefined,
    };
  }
};
