import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "./errorHandler";

let isRefreshing = false;
let queue: (() => void)[] = [];

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const requestUrl = originalRequest.url || "";

        if (error.response?.status === 401 &&
          !originalRequest._retry &&
          !requestUrl.includes("/auth/login") &&
          !requestUrl.includes("/auth/register")) {
          if (isRefreshing) {
            // wait until refresh completes
            return new Promise((resolve) =>
              queue.push(() => resolve(axiosInstance(originalRequest)))
            );
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // refresh token (from backend `/auth/refresh`)
            await axiosInstance.post("/auth/refresh");
            queue.forEach((cb) => cb());
            queue = [];
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            handleApiError(refreshError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

      handleApiError(error);
      return Promise.reject(error);
    }
  );
};
