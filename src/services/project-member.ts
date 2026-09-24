import axiosInstance from './api';

export const ProjectMemberService = {
  getProjectMembers: async (projectId: string) => {
    const response = await axiosInstance.get(`/projects/${projectId}/members`);
    return response;
  },
  removeProjectMember: async (projectMemberId: string, projectId: string) => {
    const response = await axiosInstance.delete(
      `/projects/${projectId}/members/${projectMemberId}`,
    );
    return response;
  },
};
