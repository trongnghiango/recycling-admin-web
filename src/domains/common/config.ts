import { AxiosRequestConfig } from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const config: AxiosRequestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
      Authorization: `Bearer ${"accessToken"}`,
    },
    // params: {},
    validateStatus: (_status) => true,
  };
};

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.SERVER_HOST
    : `${process.env.SERVER_HOST}${":" + process.env.PORT ?? "8081"}`;
// export const BASE_URL = `https://ortho-viewer.com/`;
