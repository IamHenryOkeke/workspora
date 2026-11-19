import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
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
  setOrganizations: (payload: unknown) => void;
  getOrganizationBySlug: (slug: string) => Organization | undefined;
  updateOrganization: (
    id: string,
    patch: Partial<Omit<Organization, 'id' | 'role'>>,
  ) => void;
  removeOrganization: (id: string) => void;
  clear: () => void;
};

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      organizations: [],

      setOrganizations: (payload) => {
        const result = organizationListSchema.safeParse(payload);
        if (!result.success) {
          console.error(
            'Invalid organisations payload:',
            result.error.flatten(),
          );
          return;
        }
        set({ organizations: result.data });
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
        set({ organizations: [] });
        queryClient.removeQueries({ queryKey: ['organizations'] });
      },
    }),
    {
      name: 'workspora-org-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organizations: state.organizations,
      }),
    },
  ),
);
