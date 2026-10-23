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
};
