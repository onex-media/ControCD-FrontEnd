import axios from "axios";
// import Cookies from 'js-cookie';

const instance = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: "https://api.controlcd.com/public/api",
  withCredentials: true,
  headers: {
    "X-Request-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});
instance.defaults.withXSRFToken = true;
instance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("XSRF-TOKEN");
    if (token) {
      config.headers["X-CSRF-TOKEN"] = token;
      console.log(token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
