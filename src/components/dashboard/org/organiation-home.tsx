'use client';

import { ApiResponse } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Building03Icon,
  ArrowLeft01Icon,
  Settings01Icon,
  UserGroupIcon,
  Crown02Icon,
} from '@hugeicons/core-free-icons';

type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER';

interface OrganizationDetail {
  organization: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo: string;
    ownerId: string;
    role: OrgRole;
    memberCount?: number;
    createdAt?: string;
  };
}

interface Member {
  id: string;
  role: OrgRole;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MembersResponse {
  members: Member[];
  pagination: Pagination;
}

const fetchOrganization = async (
  slug: string,
): Promise<ApiResponse<OrganizationDetail>> => {
  const { data } = await OrganizationService.getOrganizationBySlug(slug);
  return data;
};

const fetchOrganizationMembers = async (
  organizationId: string,
): Promise<ApiResponse<MembersResponse>> => {
  const { data } =
    await OrganizationService.getOrganizationMembers(organizationId);

  return data;
};

const ROLE_STYLES: Record<OrgRole, string> = {
  OWNER: 'bg-accent/10 text-accent',
  ADMIN: 'bg-blue-500/10 text-blue-400',
  MEMBER: 'bg-white/8 text-gray-400',
};

const ROLE_LABELS: Record<OrgRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

function RoleBadge({ role }: { role: OrgRole }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function OrgLogo({
  name,
  logo,
  size = 72,
}: {
  name: string;
  logo?: string | null;
  size?: number;
}) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-2xl object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent"
      style={{ width: size, height: size }}
    >
      <HugeiconsIcon icon={Building03Icon} size={size * 0.4} />
    </div>
  );
}

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
  const organizationId = organization?.id || '';

  const {
    isPending: isPendingMembers,
    error: membersError,
    data: membersData,
  } = useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: () => fetchOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });

  const members = membersData?.data?.members ?? [];
  console.log(members);
  const pagination = membersData?.data?.pagination;

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

      {/* Organization Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <OrgLogo name={organization.name} logo={organization.logo} />

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
        <Link
          href={`/dashboard/org/${organization.slug}/members`}
          className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-4 transition hover:border-white/15 hover:bg-white/6"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <HugeiconsIcon icon={UserGroupIcon} size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">Members</p>

            <p className="text-xs text-gray-500">
              {organization.memberCount ?? '—'}{' '}
              {organization.memberCount === 1 ? 'member' : 'members'}
            </p>
          </div>
        </Link>

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

      {/* Members */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        <div className="flex items-center justify-between border-b border-white/8 p-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Members</h2>

            <p className="mt-1 text-xs text-gray-500">
              {pagination?.total ?? organization.memberCount ?? 0}{' '}
              {(pagination?.total ?? organization.memberCount ?? 0) === 1
                ? 'member'
                : 'members'}
            </p>
          </div>

          <HugeiconsIcon
            icon={UserGroupIcon}
            size={20}
            className="text-gray-500"
          />
        </div>

        {isPendingMembers ? (
          <div className="divide-y divide-white/5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />

                  <div className="space-y-2">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-white/5" />
                    <div className="h-3 w-44 animate-pulse rounded bg-white/5" />
                  </div>
                </div>

                <div className="h-6 w-16 animate-pulse rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : membersError ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-red-400">
              Couldn&apos;t load members
            </p>

            <p className="mt-1 text-xs text-red-400/70">
              {membersError.message}
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-500">
              <HugeiconsIcon icon={UserGroupIcon} size={18} />
            </div>

            <p className="mt-3 text-sm font-medium text-white">
              No members found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              This organisation doesn&apos;t have any members yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <OrgLogo
                    name={member.user.fullName}
                    logo={member.user.avatar}
                    size={40}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {member.user.fullName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <RoleBadge role={member.role} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
