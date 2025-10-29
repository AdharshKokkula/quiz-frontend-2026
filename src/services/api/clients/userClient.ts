import axiosInstance from "../axiosInstance";

//User interface based on your schema
export interface User {
  _id: string;
  email: string;
  phone: string;
  name: string;
  password?: string;
  role: "admin" | "moderator" | "coordinator" | "user";
  status: "pending" | "verified" | "deleted"; // Updated to only these 3 values
  createdAt: string;
  updatedAt: string;
}

// Interface for creating users
export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: User["role"];
}

// API responses with pagination
export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Don't extend APIClient since we need different method signatures
export class UserClient {
  endpoint: string;

  constructor() {
    this.endpoint = "/users";
  }

  // Use specific method names to avoid conflicts
  getAllUsers = (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<UsersResponse> =>
    axiosInstance.get(this.endpoint, { params }).then((res) => res.data);

  getUserById = (id: string): Promise<User> =>
    axiosInstance.get(`${this.endpoint}/${id}`).then((res) => res.data.data);

  createUser = (data: CreateUserData): Promise<User> =>
    axiosInstance.post(this.endpoint, data).then((res) => res.data.data);

  updateUser = (id: string, data: Partial<CreateUserData>): Promise<User> =>
    axiosInstance
      .put(`${this.endpoint}/${id}`, data)
      .then((res) => res.data.data);

  deleteUser = (id: string): Promise<void> =>
    axiosInstance.delete(`${this.endpoint}/${id}`).then((res) => res.data);

  changeRole = (id: string, role: User["role"]): Promise<User> =>
    axiosInstance
      .put(`${this.endpoint}/${id}/role`, { role })
      .then((res) => res.data.data);

  updateStatus = (id: string, status: User["status"]): Promise<User> =>
    axiosInstance
      .put(`${this.endpoint}/${id}/status`, { status })
      .then((res) => res.data.data);

  updateUserStatus = (id: string, status: User["status"]): Promise<User> => {
    if (status === "verified") {
      // Use the specific verify endpoint
      return axiosInstance
        .put(`${this.endpoint}/${id}/verify`)
        .then((res) => res.data.data);
    } else {
      // For other status changes, use the main update endpoint
      return axiosInstance
        .put(`${this.endpoint}/${id}`, { status })
        .then((res) => res.data.data);
    }
  };

  getUserStats = (): Promise<{
    total: number;
    active: number;
    pending: number;
    inactive: number;
    deleted: number;
  }> =>
    axiosInstance.get(`${this.endpoint}/stats`).then((res) => res.data.data);

  resetPassword = (
    userId: string,
    data: { newPassword: string }
  ): Promise<{ message: string }> =>
    axiosInstance
      .put(`${this.endpoint}/${userId}/reset-password`, data)
      .then((res) => res.data);

  getDeletedUsers = (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    const queryParams = { ...params, status: "deleted" };
    return axiosInstance
      .get(this.endpoint, { params: queryParams })
      .then((res) => res.data);
  };

  getUsersByRole = (role: User["role"]): Promise<User[]> => {
    return axiosInstance
      .get(`${this.endpoint}/role/${encodeURIComponent(role)}`)
      .then((res) => res.data.data);
  };
}

export const userClient = new UserClient();
