import axiosInstance from './api';

export const OrganizationService = {
  getOrganizations: async (params = {}) => {
    const response = await axiosInstance.get('/organizations', { params });
    return response;
  },

  getOrganizationMembers: async (organizationId: string, params = {}) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/members`,
      { params },
    );
    return response;
  },

  createOrganization: async (data: FormData) => {
    const response = await axiosInstance.post('/organizations', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  getOrganizationById: async (organizationId: string) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}`,
    );
    return response;
  },

  getOrganizationStats: async (organizationId: string) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/stats`,
    );
    return response;
  },

  getOrganizationRecentActivity: async (organizationId: string) => {
    const response = await axiosInstance.get(
      `/organizations/${organizationId}/recent-activities`,
    );
    return response;
  },

  getOrganizationBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/organizations/slug/${slug}`);
    return response;
  },
};
