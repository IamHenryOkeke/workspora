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
};
