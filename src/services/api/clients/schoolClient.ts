// src/services/api/clients/schoolClient.ts
import axiosInstance from "../axiosInstance";
import { APIClient } from "./apiClient";

export interface Coordinator {
  name: string;
  phone: string;
  email?: string;
}

export interface School {
  schoolId: string;
  _id: string;
  name: string;
  city: string;
  coordinatorEmail: string;
  moderatorEmail: string;
  status?: string;
  coordinator?: Coordinator;
}
export class SchoolClient extends APIClient<School> {
  constructor() {
    super("/schools");
  }

  getAll = (): Promise<School[]> =>
    axiosInstance.get(this.endpoint).then((res) => res.data.data);
  getById = (id: string): Promise<School> =>
    axiosInstance.get(`${this.endpoint}/${id}`).then((res) => res.data.data);
  deleteSchool = (id: string) => axiosInstance.delete(`${this.endpoint}/${id}`);
  createSchool = (data: Partial<School>) =>
    axiosInstance.post(this.endpoint, data).then((res) => res.data);
  updateSchool = (id: string, data: Partial<School>) =>
    axiosInstance.put(`${this.endpoint}/${id}`, data).then((res) => res.data);

  getStats = (): Promise<{
    total: number;
    verified: number;
    pending: number;
    withCoordinators: number;
  }> =>
    axiosInstance.get(`${this.endpoint}/stats`).then((res) => res.data.data);
}

export const schoolClient = new SchoolClient();
