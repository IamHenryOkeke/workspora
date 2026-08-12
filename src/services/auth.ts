import axiosInstance from './api';

export const AuthService = {
  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const response = await axiosInstance.post('/auth/register', payload);
    return response;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get(
      `/auth/verify-account?token=${token}`,
    );
    return response;
  },

  login: async (payload: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', payload);
    return response;
  },

  resendVerification: async (payload: { email: string }) => {
    const response = await axiosInstance.post(
      '/auth/request-verification-link',
      payload,
    );
    return response;
  },

  forgotPassword: async (payload: { email: string }) => {
    const response = await axiosInstance.post(
      '/auth/request-password-reset',
      payload,
    );
    return response;
  },

  resetPassword: async (payload: { token: string; password: string }) => {
    const response = await axiosInstance.post('/auth/reset-password', payload);
    return response;
  },

  loginWithGoogle: async () => {
    const response = await axiosInstance.get('/auth/google');
    return response;
  },
};
