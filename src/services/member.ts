import axiosInstance from './api';

export const MemberService = {
  getMembers: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/members`,
      { params },
    );
    return response;
  },
};
