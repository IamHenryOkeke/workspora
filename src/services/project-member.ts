import { AssignMembersFormType } from '@/components/dashboard/org/projects/[id]/assign-member';
import axiosInstance from './api';
import { ORG } from './organization';

export const ProjectMemberService = {
  getProjectMembers: async (organizationId: string, projectId: string) => {
    const response = await axiosInstance.get(
      `${ORG}/${organizationId}/projects/${projectId}/members`,
    );
    return response;
  },
  removeProjectMember: async (
    id: string,
    projectId: string,
    organizationId: string,
  ) => {
    const response = await axiosInstance.delete(
      `${ORG}/${organizationId}/projects/${projectId}/members/${id}`,
    );
    return response;
  },
  createProjectMember: async (
    projectId: string,
    organizationId: string,
    payload: AssignMembersFormType,
  ) => {
    const response = await axiosInstance.post(
      `${ORG}/${organizationId}/projects/${projectId}/members`,
      payload,
    );
    return response;
  },
};
