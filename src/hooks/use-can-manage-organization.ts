import { useCurrentOrganization } from './use-current-organization';

export function useCanManageOrganization() {
  const { role } = useCurrentOrganization();
  return role === 'OWNER' || role === 'ADMIN';
}
