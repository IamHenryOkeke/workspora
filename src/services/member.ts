import { EditMemberPayload } from '@/components/dashboard/org/members/edit-member';
import axiosInstance from './api';

export const MemberService = {
  getMembers: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/members`,
      { params },
    );
    return response;
  },
  removeMember: async (organizationId: string, memberId: string) => {
    const response = await axiosInstance.delete(
      `/organizations/${organizationId}/members/${memberId}/delete`,
    );
    return response;
  },
  updateMember: async (
    organizationId: string,
    memberId: string,
    payload: EditMemberPayload,
  ) => {
    const response = await axiosInstance.put(
      `/organizations/${organizationId}/members/${memberId}/update`,
      payload,
    );
    return response;
  },
};
