import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  userClient,
  type User,
  type CreateUserData,
  type UsersResponse,
} from "../services/api/clients/userClient";

const USER_KEYS = {
  all: ["users"] as const,
  detail: (id: string) => ["user", id] as const,
  stats: ["userStats"] as const,
};

export function useUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}): UseQueryResult<UsersResponse> {
  return useQuery({
    queryKey: [...USER_KEYS.all, params],
    queryFn: () => userClient.getAllUsers(params), // Use getAllUsers
  });
}

export function useUserById(id: string): UseQueryResult<User> {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userClient.getUserById(id), // Use getUserById
  });
}

export function useCreateUser(): UseMutationResult<
  User,
  unknown,
  CreateUserData
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userClient.createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

export function useDeleteUser(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userClient.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

export function useUserStats(): UseQueryResult<{
  total: number;
  active: number;
  pending: number;
  inactive: number;
  deleted: number;
}> {
  return useQuery({
    queryKey: USER_KEYS.stats,
    queryFn: userClient.getUserStats, // Use getUserStats
  });
}

// Add to existing useUsers.ts
export function useUpdateUser(): UseMutationResult<
  User,
  unknown,
  { id: string; data: Partial<CreateUserData> }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userClient.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

// Add to useUsers.ts
export function useChangeUserRole(): UseMutationResult<
  User,
  unknown,
  { id: string; role: User["role"] }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => userClient.changeRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

export function useUpdateUserStatus(): UseMutationResult<
  User,
  unknown,
  { id: string; status: User["status"] }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => userClient.updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.all }),
  });
}

export function useResetPassword(): UseMutationResult<
  { message: string },
  unknown,
  { userId: string; newPassword: string }
> {
  return useMutation({
    mutationFn: ({ userId, newPassword }) =>
      userClient.resetPassword(userId, { newPassword }),
  });
}

export function useDeletedUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): UseQueryResult<UsersResponse> {
  return useQuery({
    queryKey: [...USER_KEYS.all, "deleted", params],
    queryFn: () => userClient.getDeletedUsers(params),
  });
}

export function useUsersByRole(role: User["role"]) {
  return useQuery<User[], Error>({
    queryKey: ["users", "role", role],
    queryFn: () => userClient.getUsersByRole(role),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
