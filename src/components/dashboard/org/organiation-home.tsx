'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { ApiResponse, Organization } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import OrganizationOrUserLogo from '../organization-user-logo';
// import Members from './members';
import OrganizationStatsSection from './organization-stats';
import OrganizationRecentActivities from './organization-recent-activities';

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
  const router = useRouter();

  const {
    isPending,
    error,
    data: organizationData,
  } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
    retry: (failureCount, err) => {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const organization = organizationData?.data?.organization;
  const isNotFound =
    error instanceof AxiosError && error.response?.status === 404;

  useEffect(() => {
    if (isNotFound) {
      router.replace('/dashboard/org');
    }
  }, [isNotFound, router]);

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
    <div>
      <div className="flex items-center gap-4">
        <OrganizationOrUserLogo
          name={organization.name}
          logo={organization.logo}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-medium text-white">
              {organization.name}
            </h1>
          </div>

          {organization.description && (
            <p className="text-sm text-white/40 line-clamp-2">
              {organization.description}
            </p>
          )}
        </div>
      </div>

      <OrganizationStatsSection organizationId={organization.id} />
      <OrganizationRecentActivities organizationId={organization.id} />
      {/* <Members organizationId={organization.id} /> */}
    </div>
  );
}
