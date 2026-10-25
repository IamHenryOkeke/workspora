import { CreateProjectFormType } from '@/components/dashboard/org/projects/add-project';
import axiosInstance from './api';
import { ORG } from './organization';
import { UpdateProjectFormType } from '@/components/dashboard/org/projects/[id]/update-project';

export const ProjectService = {
  getProjects: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `${ORG}/${organizationId}/projects`,
      { params },
    );
    return response;
  },
  getProjectById: async (organizationId: string, projectId: string) => {
    const response = await axiosInstance.get(
      `${ORG}/${organizationId}/projects/${projectId}`,
    );
    return response;
  },
  createProject: async (
    organizationId: string,
    data: CreateProjectFormType,
  ) => {
    const response = await axiosInstance.post(
      `${ORG}/${organizationId}/projects`,
      data,
    );
    return response;
  },
  updateProject: async (
    organizationId: string,
    projectId: string,
    data: UpdateProjectFormType,
  ) => {
    const response = await axiosInstance.put(
      `${ORG}/${organizationId}/projects/${projectId}`,
      data,
    );
    return response;
  },
};
