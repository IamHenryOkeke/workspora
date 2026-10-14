import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';
import { toast } from 'sonner';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

// A 401 from these endpoints means bad credentials or a dead session, not an
// expired access token, so refreshing can't help. Adjust to your actual routes.
const NO_REFRESH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false;
  const path = url.split('?')[0];
  return NO_REFRESH_ENDPOINTS.some((endpoint) => path.endsWith(endpoint));
};

// Fixed toast ids so concurrent failures show one toast, not one each
const REFRESH_TOAST_ID = 'refresh-session';
const EXPIRED_TOAST_ID = 'session-expired';

// One shared refresh for all requests that fail at the same time. With refresh
// token rotation, a second parallel refresh would fail and log the user out.
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then(({ data }) => {
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        return accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;
      toast.loading('Refreshing session...', { id: REFRESH_TOAST_ID });

      try {
        const accessToken = await refreshAccessToken();
        toast.dismiss(REFRESH_TOAST_ID);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.dismiss(REFRESH_TOAST_ID);
        useAuthStore.getState().clearAuth();

        if (window.location.pathname !== '/auth/login') {
          toast.error('Your session has expired. Please log in again.', {
            id: EXPIRED_TOAST_ID,
          });
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
