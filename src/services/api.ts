import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';
import toast from 'react-hot-toast';

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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const toastId = toast.loading('Refreshing session...');
      try {
        const { data } = await refreshClient.post('/auth/refresh');

        const { accessToken } = data;
        toast.dismiss(toastId);
        useAuthStore.getState().setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.dismiss(toastId);
        useAuthStore.getState().clearAuth();

        if (window.location.pathname !== '/auth/login') {
          toast.error('Your session has expired. Please log in again.');
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
