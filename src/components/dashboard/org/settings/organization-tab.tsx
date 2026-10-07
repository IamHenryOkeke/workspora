import DeleteOrganization from './delete-organization';
import UpdateOrganization from './update-organization';
import { Organization } from '@/lib/types';

export default function OrganizationTab({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="mt-4 space-y-6">
      <UpdateOrganization organization={organization} />
      <DeleteOrganization organization={organization} />
    </div>
  );
}
