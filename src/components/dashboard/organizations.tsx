'use client';

import { ApiResponse, Organization, PaginationType } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Building03Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  SearchRemoveIcon,
} from '@hugeicons/core-free-icons';
import Search from './search';
import Pagination from './pagination';
import RoleBadge from './role-badge';
import OrganizationOrUserLogo from './organization-user-logo';

type OrganizationsResponse = {
  organizations: Organization[];
  pagination: PaginationType;
};

export const fetchOrganizations = async (
  page?: number,
  query?: string,
): Promise<ApiResponse<OrganizationsResponse>> => {
  const { data } = await OrganizationService.getOrganizations({
    ...(page && { page }),
    ...(query && { searchTerm: query }),
  });
  return data;
};

function Header({ count }: { count: number }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">Your organizations</h1>
      <p className="mt-1 text-sm text-gray-500">
        {count === null ? (
          <span className="inline-block h-4 w-16 animate-pulse rounded bg-white/5 align-middle" />
        ) : (
          <>
            {count} {count === 1 ? 'organization' : 'organizations'}
          </>
        )}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1">
          <Search />
        </div>
        <Link
          href="/dashboard/create-org"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent/80 hover:-translate-y-px active:translate-y-0"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          New organization
        </Link>
      </div>
    </div>
  );
}

export default function Organizations({
  page,
  query,
}: {
  page: number;
  query: string;
}) {
  const { isPending, error, data } = useQuery({
    queryKey: ['organizations', { page, query }],
    queryFn: () => fetchOrganizations(page, query),
  });

  const organizations = data?.data?.organizations;
  const pagination = data?.data?.pagination;
  const isSearching = Boolean(query);
  const count = pagination?.total ? pagination.total : 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Header count={isPending ? 0 : count} />

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/5"
            />
          ))}
        </div>
      )}

      {!isPending && error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load your organizations
          </p>
          <p className="mt-1 text-xs text-red-400/70">{error.message}</p>
        </div>
      )}

      {!isPending &&
        !error &&
        organizations &&
        organizations.length === 0 &&
        (isSearching ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <HugeiconsIcon
                icon={SearchRemoveIcon}
                size={26}
                className="text-gray-400"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                No results for &quot;{query}&quot;
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Try a different name or check your spelling.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <HugeiconsIcon
                icon={Building03Icon}
                size={26}
                className="text-accent"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                No organizations yet
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Create your first organization to get started.
              </p>
            </div>
            <Link
              href="/dashboard/create-org"
              className="mt-2 flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent/80 hover:-translate-y-px active:translate-y-0"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
              Create Organization
            </Link>
          </div>
        ))}

      {!isPending && !error && organizations && organizations.length > 0 && (
        <>
          <ul className="grid gap-4 sm:grid-cols-2">
            {organizations.map((org) => (
              <li key={org.id}>
                <Link
                  href={`/dashboard/org/${org.slug}/home`}
                  className="group flex h-full items-center gap-4 rounded-xl border border-white/8 bg-white/3 p-6 transition hover:border-white/15 hover:bg-white/6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <OrganizationOrUserLogo name={org.name} logo={org.logo} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-base font-semibold text-white">
                        {org.name}
                      </p>
                      <RoleBadge role={org.role} />
                    </div>
                    {org.description && (
                      <p className="mt-0.5 truncate text-xs text-gray-600">
                        {org.description}
                      </p>
                    )}
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-gray-400"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {pagination && pagination.totalPages > 1 && (
            <Pagination totalPages={pagination.totalPages} />
          )}
        </>
      )}
    </div>
  );
}
