import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; identifier: string; firstName?: string; lastName?: string; role: string } | null;
  accessToken: string | null;
  error: string | null;
  setAuth: (user: any, token: string) => void;
  setAccessToken: (token: string) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      error: null,
      setAuth: (user, token) => set({ user, accessToken: token, error: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, accessToken: null, error: null }),
    }),
    {
      name: 'auth-store',
    },
  ),
);
