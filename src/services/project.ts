import axiosInstance from './api';

export const ProjectService = {
  getProjects: async (params = {}) => {
    const response = await axiosInstance.get('/projects', { params });
    return response;
  },
};
