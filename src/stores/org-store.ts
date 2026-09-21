import { create } from 'zustand';
import { z } from 'zod';
import { OrganizationService } from '@/services/organization';
import { queryClient } from '@/lib/queryClient';

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  logo: z.string(),
  role: z.string(),
});

export const organizationListSchema = z.array(organizationSchema);

export type Organization = z.infer<typeof organizationSchema>;

type OrganizationStore = {
  organizations: Organization[];
  hasFetched: boolean;
  fetchOrganizations: () => Promise<void>;
  setOrganizations: (payload: unknown) => void;
  getOrganizationBySlug: (slug: string) => Organization | undefined;
  clear: () => void;
};

const organizationsQuery = {
  queryKey: ['organizations'] as const,
  queryFn: async () => {
    const res = await OrganizationService.getOrganizations();
    return res.data.data.organizations;
  },
};

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organizations: [],
  hasFetched: false,

  fetchOrganizations: async () => {
    try {
      const data = await queryClient.fetchQuery(organizationsQuery);
      const result = organizationListSchema.safeParse(data);

      if (!result.success) {
        console.error('Invalid organisations payload:', result.error.flatten());
        return;
      }

      set({ organizations: result.data, hasFetched: true });
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  },

  setOrganizations: (payload) => {
    const result = organizationListSchema.safeParse(payload);
    if (!result.success) {
      console.error('Invalid organisations payload:', result.error.flatten());
      return;
    }
    set({ organizations: result.data, hasFetched: true });
  },

  getOrganizationBySlug: (slug) => {
    return get().organizations.find((org) => org.slug === slug);
  },

  clear: () => {
    set({ organizations: [], hasFetched: false });
    // Also drop the cached query so a later fetchOrganizations() call
    // actually re-fetches rather than immediately restoring the
    // cleared data from cache.
    queryClient.removeQueries({ queryKey: organizationsQuery.queryKey });
  },
}));
