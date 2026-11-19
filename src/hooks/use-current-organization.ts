import { useOrganizationStore } from '@/stores/org-store';
import { useParams } from 'next/navigation';

export function useCurrentOrganization() {
  const { slug } = useParams<{ slug: string }>();
  const { getOrganizationBySlug } = useOrganizationStore();

  const organization = getOrganizationBySlug(slug);

  return { organization, role: organization?.role };
}
