import { create } from "zustand";

export type UserRole = "admin" | "moderator" | "coordinator" | "user";
export type UserStatus = "pending" | "verified" | "deleted";

interface UserState {
  role: UserRole | null;
  status: UserStatus | null;
  setRole: (role: UserRole) => void;
  setStatus: (status: UserStatus) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null as unknown as UserRole,
  status: null as unknown as UserStatus,
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
}));
