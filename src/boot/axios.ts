import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

export const baseURL = "http://127.0.0.1:8000/api";
export const pathImage = "http://localhost:8000/storage/";
export const api = axios.create({ baseURL: baseURL });

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
