import axios from 'axios';
import toast from 'react-hot-toast';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
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
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        if (window.location.pathname !== '/auth/login') {
          toast.error('Unauthorized access. Please log in again.');
          localStorage.removeItem('authToken');
          window.location.href = '/auth/login';
        }
      }
    } else {
      toast.error('Network error. Please check your internet connection.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
