import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  schoolClient,
  type School,
} from "../services/api/clients/schoolClient";

const SCHOOL_KEYS = {
  all: ["schools"] as const,
  detail: (id: string) => ["school", id] as const,
  stats: ["schoolStats"] as const,
};

export function useSchools(): UseQueryResult<School[]> {
  return useQuery({
    queryKey: SCHOOL_KEYS.all,
    queryFn: schoolClient.getAll,
  });
}

export function useSchoolById(id: string): UseQueryResult<School> {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: SCHOOL_KEYS.detail(id),
    queryFn: () => schoolClient.getById(id),
    initialData: () => {
      const cached = queryClient.getQueryData<School[]>(SCHOOL_KEYS.all);
      return cached?.find((s) => s._id === id);
    },
  });
}

export function useCreateSchool(): UseMutationResult<
  School,
  unknown,
  Partial<School>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => schoolClient.createSchool(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all }),
  });
}

export function useUpdateSchool(): UseMutationResult<
  School,
  unknown,
  { id: string; data: Partial<School> }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => schoolClient.updateSchool(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all }),
  });
}

export function useDeleteSchool(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await schoolClient.deleteSchool(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all }),
  });
}

export function useSchoolStats(): UseQueryResult<{
  total: number;
  verified: number;
  pending: number;
  withCoordinators: number;
}> {
  return useQuery({
    queryKey: SCHOOL_KEYS.stats,
    queryFn: schoolClient.getStats,
  });
}
