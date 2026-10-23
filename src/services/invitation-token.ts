import axiosInstance from './api';

export const InvitationTokenService = {
  getInvitationByInviteToken: async (token: string) => {
    const response = await axiosInstance.get(`/invitations/${token}`);
    return response;
  },
  acceptInvitationByInviteToken: async (token: string) => {
    const response = await axiosInstance.post(`/invitations/${token}/accept`);
    return response;
  },
  declineInvitationByInviteToken: async (token: string) => {
    const response = await axiosInstance.post(`/invitations/${token}/decline`);
    return response;
  },
};
