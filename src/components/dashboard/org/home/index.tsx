'use client';

import OrganizationStatsSection from './organization-stats';
import OrganizationRecentActivities from './organization-recent-activities';
import OrganizationOrUserLogo from '../../organization-user-logo';
import OrganizationRecentProjects from './organization-recent-projects';
import { useGetOrganization } from '@/hooks/use-get-organization';

export default function OrganizationHome({ slug }: { slug: string }) {
  const { isPending, organization, error, isNotFound } =
    useGetOrganization(slug);

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-white/5" />

        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-6">
          <div className="h-18 w-18 animate-pulse rounded-2xl bg-white/5" />

          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-64 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="text-sm text-gray-500">
          This organisation doesn&apos;t exist or you no longer have access.
          Redirecting...
        </p>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load this organisation
          </p>

          <p className="mt-1 text-xs text-red-400/70">
            {error?.message ??
              'It may not exist, or you may not have access to it.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <OrganizationOrUserLogo
          name={organization.name}
          logo={organization.logo}
        />
        <div>
          <h1 className="truncate text-xl font-medium text-white">
            {organization.name}
          </h1>
          <p className="text-sm text-white/40">{organization.description}</p>
        </div>
      </div>

      <OrganizationStatsSection organizationId={organization.id} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <OrganizationRecentProjects organizationId={organization.id} />
        <OrganizationRecentActivities organizationId={organization.id} />
      </div>
    </div>
  );
}
