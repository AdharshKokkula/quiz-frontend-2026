import axios from "axios";
import { setupInterceptors } from "./interceptors";
import Cookies from "js-cookie";


const token = Cookies.get("token")

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Authorization" : `Bearer ${token}`
  },
});

// Attach interceptors for refresh & error handling
setupInterceptors(axiosInstance);

export default axiosInstance;
