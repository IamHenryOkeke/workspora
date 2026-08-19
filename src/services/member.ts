import axiosInstance from './api';

export const MemberService = {
  getMembers: async (params = {}) => {
    const response = await axiosInstance.get('/organizations', { params });
    return response;
  },
};
