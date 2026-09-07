import { create } from 'zustand';
import { z } from 'zod';
import { OrganizationService } from '@/services/organization';

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

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organizations: [],
  hasFetched: false,

  fetchOrganizations: async () => {
    const res = await OrganizationService.getOrganizations();
    const data = res.data.data.organizations;
    console.log('Fetched organizations:', data);
    set({ organizations: data, hasFetched: true });
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
  },
}));
