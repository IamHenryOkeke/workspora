import { InviteMemberFormType } from '@/components/dashboard/org/members/invite-member';
import axiosInstance from './api';

export const InvitationService = {
  inviteMember: async (
    organizationId: string,
    payload: InviteMemberFormType,
  ) => {
    const response = await axiosInstance.post(
      `/organizations/${organizationId}/invitations`,
      payload,
    );
    return response;
  },
  getInvitations: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/invitations`,
      { params },
    );
    return response;
  },
  resendInvitation: async (organizationId: string, invitationId: string) => {
    const response = await axiosInstance.post(
      `/organizations/${organizationId}/invitations/${invitationId}/resend`,
    );
    return response;
  },
  revokeInvitation: async (organizationId: string, invitationId: string) => {
    const response = await axiosInstance.delete(
      `/organizations/${organizationId}/invitations/${invitationId}`,
    );
    return response;
  },
  acceptInvitation: async (invitationId: string, organizationId: string) => {
    const response = await axiosInstance.post(
      `/organizations/${organizationId}/invitations/${invitationId}/accept`,
    );
    return response;
  },
  declineInvitation: async (invitationId: string) => {
    const response = await axiosInstance.post(
      `/invitations/${invitationId}/decline`,
    );
    return response;
  },
};
