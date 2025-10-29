import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import {
  participantsClient,
  type Participant,
  type ParticipantsResponse,
} from "../services/api/clients/participantsClient";

// ✅ Get all participants
export const useParticipantsData = () => {
  return useQuery<ParticipantsResponse, Error>({
    queryKey: ["participants"],
    queryFn: participantsClient.getAllParticipants,
    initialData: { data: [], total: 0 },
  });
};

// ✅ Get participants by school
export function useParticipantsBySchool(schoolId: string): UseQueryResult<Participant[]> {
  return useQuery({
    queryKey: ["participants", "school", schoolId],
    queryFn: () => participantsClient.getBySchool(schoolId),
    enabled: !!schoolId,
  });
}

// ✅ Get participant by ID
export const useParticipantById = (id: string | undefined) =>
  useQuery<Participant, Error>({
    queryKey: ["participant", id],
    queryFn: () => participantsClient.getById(id!),
    enabled: !!id,
  });

// ✅ Update participant
export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      participantId,
      data,
    }: {
      participantId: string;
      data: Partial<Participant>;
    }) => participantsClient.updateParticipant(participantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};

// ✅ Create participant
export const useCreateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newParticipant: any) =>
      participantsClient.createParticipant(newParticipant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};

// ✅ Bulk insert participants
export const useBulkInsertParticipants = () => {
  return useMutation({
    mutationFn: (participants: Participant[]) =>
      participantsClient.bulkInsert(participants),
  });
};

// ✅ Verify participant
export const useVerifyParticipant = () => {
  return useMutation({
    mutationFn: (id: string) => participantsClient.verifyParticipant(id),
  });
};

// ✅ Search participants
export const useSearchParticipants = (query: string) => {
  return useQuery<Participant[], Error>({
    queryKey: ["participants", "search", query],
    queryFn: () => participantsClient.search(query),
    enabled: !!query,
  });
};

export const useBulkUpdateParticipants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      participants: { participantId: string; status: string }[];
    }) => participantsClient.bulkUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};
