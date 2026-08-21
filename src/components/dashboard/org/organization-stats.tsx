'use client';

import { ApiResponse, OrganizationStats, StatCount } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderLibraryIcon, UserGroupIcon } from '@hugeicons/core-free-icons';

type OrganizationStatsResponse = {
  stats: OrganizationStats;
};

const fetchOrganizationStats = async (
  organizationId: string,
): Promise<ApiResponse<OrganizationStatsResponse>> => {
  const { data } =
    await OrganizationService.getOrganizationByStats(organizationId);
  return data;
};

function BreakdownList({
  title,
  items,
}: {
  title: string;
  items: StatCount[];
}) {
  const total = items.reduce((sum, item) => sum + item._count, 0);

  if (!items.length) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <p className="text-sm font-medium text-white">{title}</p>

      <div className="mt-3 space-y-2">
        {items.map((item) => {
          const label = item.role ?? item.status ?? 'Unknown';
          const pct = total > 0 ? Math.round((item._count / total) * 100) : 0;

          return (
            <div key={label} className="flex items-center gap-3 text-xs">
              <span className="w-24 shrink-0 truncate capitalize text-gray-400">
                {label.toLowerCase()}
              </span>

              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="w-6 shrink-0 text-right text-gray-500">
                {item._count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrganizationStatsSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    isPending,
    error,
    data: statsData,
  } = useQuery({
    queryKey: ['organization-stats', organizationId],
    queryFn: () => fetchOrganizationStats(organizationId),
    enabled: !!organizationId,
  });

  const stats = statsData?.data?.stats;

  if (isPending) {
    return (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="h-16 animate-pulse rounded-xl border border-white/8 bg-white/3" />
        <div className="h-16 animate-pulse rounded-xl border border-white/8 bg-white/3" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
        <p className="text-xs text-red-400/70">Couldn&apos;t load stats</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <HugeiconsIcon icon={UserGroupIcon} size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {stats.totalMembers}{' '}
              {stats.totalMembers === 1 ? 'member' : 'members'}
            </p>
            <p className="text-xs text-gray-500">Total members</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <HugeiconsIcon icon={FolderLibraryIcon} size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {stats.totalProjects}{' '}
              {stats.totalProjects === 1 ? 'project' : 'projects'}
            </p>
            <p className="text-xs text-gray-500">Total projects</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <BreakdownList title="Members by role" items={stats.membersByRole} />
        <BreakdownList
          title="Members by status"
          items={stats.membersByStatus}
        />
        <BreakdownList
          title="Projects by status"
          items={stats.projectsByStatus}
        />
      </div>
    </div>
  );
}
