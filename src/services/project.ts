import { CreateProjectPayloadType } from '@/components/dashboard/org/projects/add-project';
import axiosInstance from './api';
import { UpdateProjectPayloadType } from '@/components/dashboard/org/projects/[id]/update-project';

export const ProjectService = {
  getProjects: async (params = {}) => {
    const response = await axiosInstance.get('/projects', { params });
    return response;
  },
  getProjectById: async (projectId: string, params = {}) => {
    const response = await axiosInstance.get(`/projects/${projectId}`, {
      params,
    });
    return response;
  },
  createProject: async (data: CreateProjectPayloadType) => {
    const response = await axiosInstance.post('/projects', data);
    return response;
  },
  updateProject: async (projectId: string, data: UpdateProjectPayloadType) => {
    const response = await axiosInstance.put(`/projects/${projectId}`, data);
    return response;
  },
};
