import { EditMemberPayload } from '@/components/dashboard/org/members/edit-member';
import axiosInstance from './api';
import { ORG } from './organization';

export const MemberService = {
  getMembers: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `${ORG}/${organizationId}/members`,
      { params },
    );
    return response;
  },
  removeMember: async (organizationId: string, memberId: string) => {
    const response = await axiosInstance.delete(
      `${ORG}/${organizationId}/members/${memberId}/delete`,
    );
    return response;
  },
  updateMember: async (
    organizationId: string,
    memberId: string,
    payload: EditMemberPayload,
  ) => {
    const response = await axiosInstance.put(
      `${ORG}/${organizationId}/members/${memberId}/update`,
      payload,
    );
    return response;
  },
};
