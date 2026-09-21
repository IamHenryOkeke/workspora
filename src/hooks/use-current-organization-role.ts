import { useCurrentOrganization } from './use-current-organization';

export function useCurrentOrganizationRole() {
  const { role, isLoading } = useCurrentOrganization();
  return { role, isLoading };
}
