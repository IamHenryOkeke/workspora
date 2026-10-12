'use client';

import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import UpdateOrganization from './update-organization';
import DeleteOrganization from './delete-organization';

export default function SettingsHome({ slug }: { slug: string }) {
  const { organization, isPending, isNotFound } = useGetOrganization(slug);

  usePageTitle(organization ? `Settings | ${organization.name}` : 'Loading');

  const header = (
    <div className="mb-8 flex items-start justify-between gap-4">
      <h1 className="text-2xl font-medium text-white">Settings</h1>
    </div>
  );

  if (isPending) {
    return (
      <div>
        {header}
        <div className="mb-6 h-9 w-56 animate-pulse rounded bg-white/5" />
        <div className="h-72 max-w-2xl animate-pulse rounded-md bg-white/5" />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          This organisation doesn&apos;t exist or you no longer have access.
        </p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-medium text-red-400">
          Couldn&apos;t load settings
        </p>
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="mt-4 space-y-6">
        <UpdateOrganization organization={organization} />
        <DeleteOrganization organization={organization} />
      </div>
    </div>
  );
}
