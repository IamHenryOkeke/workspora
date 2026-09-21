import { useOrganizationStore } from '@/stores/org-store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export function useCurrentOrganization() {
  const { slug } = useParams<{ slug: string }>();
  const { fetchOrganizations, hasFetched } = useOrganizationStore();
  const organization = useOrganizationStore((state) =>
    state.getOrganizationBySlug(slug),
  );

  useEffect(() => {
    if (!hasFetched) fetchOrganizations();
  }, [hasFetched, fetchOrganizations]);

  return { organization, role: organization?.role, isLoading: !hasFetched };
}
