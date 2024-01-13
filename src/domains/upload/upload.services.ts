import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import environment from "environment";
import { BASE_URL } from "../common/config";
import { ApiResponse } from "../interfaces/ApiResponse";

export const uploadFileRequest = async (
  userId: string,
  formData: FormData,
  progressCallback?: (progressEvent: AxiosProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
  const config: AxiosRequestConfig = {
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    params: { userId },
    onUploadProgress: progressCallback,
    validateStatus: (_status) => true,
  };
  const response = await axios.post("/api/uploads", formData, config);

  return response.data;
};

export const deleteFileRequest = async (
  userId: string,
  fileName: string,
  progressCallback?: (progressEvent: AxiosProgressEvent) => void
): Promise<ApiResponse<string>> => {
  const config: AxiosRequestConfig = {
    headers: { "content-type": "multipart/form-data" },
    params: { userId, fileName },
    onUploadProgress: progressCallback,
    validateStatus: (_status) => true,
  };
  const response = await axios.delete("/api/v1/upload", config);

  return response.data;
};

export const getListFiles = async (
  userId: string,
  progressCallback?: (progressEvent: AxiosProgressEvent) => void,
  server?: { req: any; res: any }
): Promise<ApiResponse<string>> => {
  const url = `${server ? BASE_URL : ""}/api/v1/ortho/get-by-patient`;
  // const url = `${server ? BASE_URL : ""}/api/readfiles`;
  const config: AxiosRequestConfig = {
    headers: {
      "content-type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
    params: { userId },
    onUploadProgress: progressCallback,
    validateStatus: (_status) => true,
  };
  const response = await axios.get(url, config);

  return response.data;
};

export const uploadAvatarRequest = async (
  clinicCode: string,
  formData: FormData,
  progressCallback?: (progressEvent: AxiosProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
  const config: AxiosRequestConfig = {
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    params: { clinicCode },
    onUploadProgress: progressCallback,
    validateStatus: (_status) => true,
  };
  console.log("reeq", formData);
  const response = await axios.post("/api/v1/uploads/logo", formData, config);
  console.log("res---", { response });

  return response.data;
};
