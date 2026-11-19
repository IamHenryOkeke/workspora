'use client';

import { ApiResponse, OrganizationStats } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';

type OrganizationStatsResponse = {
  stats: OrganizationStats;
};

const fetchOrganizationStats = async (
  organizationId: string,
): Promise<ApiResponse<OrganizationStatsResponse>> => {
  const { data } =
    await OrganizationService.getOrganizationStats(organizationId);
  return data;
};

function StatCard({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 sm:p-6">
      <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-300">{label}</p>
      <p className="mt-0.5 text-xs text-gray-500">{sublabel}</p>
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
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/3 sm:h-32" />
        <div className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/3 sm:h-32" />
        <div className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/3 sm:h-32" />
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
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        value={stats.activeProjects}
        label="Active projects"
        sublabel={`${stats.totalProjects} total`}
      />
      <StatCard
        value={stats.activeMembers}
        label="Active members"
        sublabel={`${stats.totalMembers} total`}
      />
      <StatCard
        value={stats.pendingInvitations}
        label="Pending invitations"
        sublabel="awaiting response"
      />
    </div>
  );
}
