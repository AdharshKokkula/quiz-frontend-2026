import axiosInstance from "../axiosInstance";
import { APIClient } from "./apiClient";

export interface Participant {
  status: string;
  teamId: string;
  participantId: string;
  name: string;
  fatherName: string;
  class: string;
  email: string;
  phone: string;
  dob: string;
  school: string;
  homeTown: string;
  type: string;
  registeredAt: string;
  verifiedAt: string;
  verifiedBy: string;
}

export interface ParticipantsResponse {
  data: Participant[];
  total: number;
}

export class ParticipantsClient extends APIClient<Participant> {
  constructor() {
    super("/participants");
  }

  getAllParticipants = async (): Promise<ParticipantsResponse> => {
    const res = await axiosInstance.get(this.endpoint);

    const participants = res.data?.data ?? [];
    const total = res.data?.pagination?.total ?? participants.length;
    return { data: participants, total };
  };
 createParticipant = async (payload: Partial<Participant>): Promise<Participant> => {
  console.log("participantsClient.createParticipant called with:", JSON.stringify(payload));
  const res = await axiosInstance.post(this.endpoint, payload);
  return res.data?.data as Participant;
};

  getById = async (id: string): Promise<Participant> => {
    const res = await axiosInstance.get(`${this.endpoint}/${id}`);
    return res.data?.data as Participant;
  };
  updateParticipant = async (
    id: string,
    data: Partial<Participant>
  ): Promise<Participant> => {
    const res = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return res.data?.data as Participant;
  };

  search = (query: string) =>
    axiosInstance
      .get(`${this.endpoint}/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.data as Participant[]);

  getBySchool = (school: string) =>
    axiosInstance
      .get(`${this.endpoint}/school/${encodeURIComponent(school)}`)
      .then((res) => res.data as Participant[]);

  getByType = (type: string) =>
    axiosInstance
      .get(`${this.endpoint}/type/${type}`)
      .then((res) => res.data as Participant[]);

  getByStatus = (status: string) =>
    axiosInstance
      .get(`${this.endpoint}/status/${status}`)
      .then((res) => res.data as Participant[]);

  bulkInsert = (participants: Participant[]) =>
    axiosInstance
      .post(this.endpoint + "/bulk-insert", { participants })
      .then((res) => res.data);

  bulkVerify = (participantIds: string[]) =>
    axiosInstance.put(this.endpoint + "/bulk-verify", { participantIds });

  verifyParticipant = (participantId: string) =>
    axiosInstance
      .put(`${this.endpoint}/${participantId}/verify`)
      .then((res) => res.data);
  bulkUpdate = (data: {
    participants: { participantId: string; status: string }[];
  }) =>
    axiosInstance
      .put(this.endpoint + "/bulk-update", data)
      .then((res) => res.data);
}

export const participantsClient = new ParticipantsClient();


