import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '@/services/auth';
import toast from 'react-hot-toast';
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (payload: { user: User; accessToken: string }) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
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
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: ({ user, accessToken }) => {
        setCookie(accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      setAccessToken: (accessToken) => {
        setCookie(accessToken);
        set({ accessToken });
      },

      clearAuth: async () => {
        const res = await AuthService.logout();
        console.log('Logout response:', res);
        if (res.status === 200) {
          clearCookie();
          set({ user: null, accessToken: null, isAuthenticated: false });
        } else {
          toast.error('Logout failed');
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'workspora-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
