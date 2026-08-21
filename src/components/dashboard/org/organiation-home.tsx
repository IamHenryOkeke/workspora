'use client';

import { ApiResponse, Organization } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Settings01Icon,
  Crown02Icon,
} from '@hugeicons/core-free-icons';
import OrganizationOrUserLogo from '../organization-user-logo';
import RoleBadge from '../role-badge';
import Members from './members';
import OrganizationStatsSection from './organization-stats';

type OrganizationDetail = {
  organization: Organization;
};

const fetchOrganization = async (
  slug: string,
): Promise<ApiResponse<OrganizationDetail>> => {
  const { data } = await OrganizationService.getOrganizationBySlug(slug);
  return data;
};

export default function OrganizationHome({ slug }: { slug: string }) {
  const {
    isPending: isPendingOrganization,
    error: organizationError,
    data: organizationData,
  } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
  });

  const organization = organizationData?.data?.organization;

  const canManage =
    organization?.role === 'OWNER' || organization?.role === 'ADMIN';

  if (isPendingOrganization) {
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

  if (organizationError || !organization) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/dashboard/org"
          className="mb-6 flex w-fit items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to organisations
        </Link>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load this organisation
          </p>

          <p className="mt-1 text-xs text-red-400/70">
            {organizationError?.message ??
              'It may not exist, or you may not have access to it.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/org"
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        Back to organisations
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <OrganizationOrUserLogo
            name={organization.name}
            logo={organization.logo}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold text-white">
                {organization.name}
              </h1>

              <RoleBadge role={organization.role} />
            </div>

            {organization.description && (
              <p className="mt-1 text-sm text-gray-400">
                {organization.description}
              </p>
            )}
          </div>
        </div>

        {canManage && (
          <Link
            href={`/dashboard/org/${organization.slug}/settings`}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
          >
            <HugeiconsIcon icon={Settings01Icon} size={16} />
            Settings
          </Link>
        )}
      </div>

      {/* Organization Stats */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {organization.role === 'OWNER' && (
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
              <HugeiconsIcon icon={Crown02Icon} size={18} />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                You own this organisation
              </p>

              <p className="text-xs text-gray-500">
                Full access to settings and billing
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed stats: member/project breakdowns */}
      <OrganizationStatsSection organizationId={organization.id} />

      <Members organizationId={organization.id} />
    </div>
  );
}
