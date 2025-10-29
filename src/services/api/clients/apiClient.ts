import { type AxiosRequestConfig } from "axios";
import axiosInstance from "../axiosInstance";

export class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config?: AxiosRequestConfig) =>
    axiosInstance.get<T[]>(this.endpoint, config).then((res) => res.data);

  get = (id: string | number) =>
    axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

  create = (data: T) =>
    axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);

  update = (id: string | number, data: Partial<T>) =>
    axiosInstance
      .put<T>(`${this.endpoint}/${id}`, data)
      .then((res) => res.data);

  delete = (id: string | number) =>
    axiosInstance.delete(`${this.endpoint}/${id}`).then((res) => res.data);
}
