import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  userId: null,

  login: (token, userId) => set({ isAuthenticated: true, token, userId }),
  logout: () => set({ isAuthenticated: false, token: null, userId: null }),
}));
