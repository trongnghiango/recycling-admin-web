import { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const config: AxiosRequestConfig = {
  baseURL: 'http://localhost:9000',
}
const agentApi = {
  getList(params?: any) {
    const url = '/api/v1/agent/list'
    return axiosClient.get(url, {
      ...config
    })
  },
  get(id: string | number) {
    if (!id) return "error"
  },
  put(data: any) {

  },
  delete(id) {

  },
}

export default agentApi;