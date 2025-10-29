import axiosInstance from "../axiosInstance";

export const AuthClient = {
  register: (data: { name: string; email: string; password: string }) =>
    axiosInstance.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/auth/login", data),

  logout: () => axiosInstance.post("/auth/logout"),

  profile: () => axiosInstance.get("/auth/profile"),

  updateProfile: (data: { name?: string; email?: string }) =>
    axiosInstance.put("/auth/profile", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put("/auth/change-password", data),

  refresh: () => axiosInstance.post("/auth/refresh"),

  verify: () => axiosInstance.get("/auth/verify"),
};
