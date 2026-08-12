import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

const ACCESS_TOKEN_COOKIE = 'access_token';

function setCookie(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; path=/; max-age=3600; SameSite=Lax`;
}

function clearCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: ({ user, token }) => {
        setCookie(token);
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      setToken: (token) => {
        setCookie(token);
        set({ token });
      },

      clearAuth: () => {
        clearCookie();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
