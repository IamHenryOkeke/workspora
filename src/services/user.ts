import axiosInstance from './api';

export const UserService = {
  getMe: async () => {
    const response = await axiosInstance.get('/users/me');
    return response;
  },
  changePassword: async (payload: {
    currentPassword?: string;
    newPassword: string;
  }) => {
    const response = await axiosInstance.put(
      '/users/me/change-password',
      payload,
    );
    return response;
  },
  updateProfile: async (payload: FormData) => {
    const response = await axiosInstance.put('/users/me', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
};
