import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import { OrganizationService } from '@/services/organization';
import { queryClient } from '@/lib/queryClient';

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  logo: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});

export const organizationListSchema = z.array(organizationSchema);

export type Organization = z.infer<typeof organizationSchema>;

type OrganizationStore = {
  organizations: Organization[];
  hasFetched: boolean;
  fetchOrganizations: () => Promise<void>;
  setOrganizations: (payload: unknown) => void;
  getOrganizationBySlug: (slug: string) => Organization | undefined;
  updateOrganization: (
    id: string,
    patch: Partial<Omit<Organization, 'id' | 'role'>>,
  ) => void;
  removeOrganization: (id: string) => void;
  clear: () => void;
};

const organizationsQuery = {
  queryKey: ['organizations'] as const,
  queryFn: async () => {
    const res = await OrganizationService.getOrganizations();
    return res.data.data.organizations;
  },
};

let generation = 0;

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      organizations: [],
      hasFetched: false,

      fetchOrganizations: async () => {
        const current = generation;
        try {
          const data = await queryClient.fetchQuery(organizationsQuery);
          if (current !== generation) return;
          const result = organizationListSchema.safeParse(data);

          if (!result.success) {
            console.error(
              'Invalid organisations payload:',
              result.error.flatten(),
            );
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
          console.error(
            'Invalid organisations payload:',
            result.error.flatten(),
          );
          return;
        }
        set({ organizations: result.data, hasFetched: true });
      },

      getOrganizationBySlug: (slug) => {
        return get().organizations.find((org) => org.slug === slug);
      },

      updateOrganization: (id, patch) => {
        set((state) => ({
          organizations: state.organizations.map((org) =>
            org.id === id ? { ...org, ...patch } : org,
          ),
        }));
      },

      removeOrganization: (id: string) => {
        set((state) => ({
          organizations: state.organizations.filter((org) => org.id !== id),
        }));
      },

      clear: () => {
        generation += 1;
        set({ organizations: [], hasFetched: false });
        queryClient.removeQueries({ queryKey: organizationsQuery.queryKey });
      },
    }),
    {
      name: 'workspora-org-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organizations: state.organizations,
        hasFetched: state.hasFetched,
      }),
    },
  ),
);
