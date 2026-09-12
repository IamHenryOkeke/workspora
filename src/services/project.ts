import { NewProjectPayload } from '@/components/dashboard/org/projects/add-project';
import axiosInstance from './api';

export const ProjectService = {
  getProjects: async (params = {}) => {
    const response = await axiosInstance.get('/projects', { params });
    return response;
  },
  createProject: async (organizationId: string, data: NewProjectPayload) => {
    const response = await axiosInstance.post('/projects', {
      organizationId,
      ...data,
    });
    return response;
  },
};
