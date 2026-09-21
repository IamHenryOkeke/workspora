import { useCurrentOrganizationRole } from './use-current-organization-role';

export function useCanManageOrganization() {
  const { role } = useCurrentOrganizationRole();
  return role === 'OWNER' || role === 'ADMIN';
}
