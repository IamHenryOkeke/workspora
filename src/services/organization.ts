import axiosInstance from './api';

export const ORG = '/organizations';
export const OrganizationService = {
  getOrganizations: async (params = {}) => {
    const response = await axiosInstance.get(ORG, { params });
    return response;
  },

  createOrganization: async (data: FormData) => {
    const response = await axiosInstance.post(ORG, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  updateOrganization: async (organizationId: string, data: FormData) => {
    const response = await axiosInstance.put(`${ORG}/${organizationId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteOrganization: async (organizationId: string) => {
    const response = await axiosInstance.delete(`${ORG}/${organizationId}`);
    return response;
  },

  getOrganizationById: async (organizationId: string) => {
    const response = await axiosInstance.get(`${ORG}/${organizationId}`);
    return response;
  },

  getOrganizationStats: async (organizationId: string) => {
    const response = await axiosInstance.get(`${ORG}/${organizationId}/stats`);
    return response;
  },

  getOrganizationRecentActivity: async (organizationId: string) => {
    const response = await axiosInstance.get(
      `${ORG}/${organizationId}/recent-activities`,
    );
    return response;
  },

  getOrganizationBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`${ORG}/slug/${slug}`);
    return response;
  },

  leaveOrganization: async (organizationId: string) => {
    const response = await axiosInstance.post(`${ORG}/${organizationId}/leave`);
    return response;
  },
};
