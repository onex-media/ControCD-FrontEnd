import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BASE_URL || "https://controlcd.com/back/public/api/",
  withCredentials: true,
  headers: {
    "X-Request-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (!token) return config;
    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
