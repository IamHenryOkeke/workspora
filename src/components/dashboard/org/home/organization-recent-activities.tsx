'use client';

import { ApiResponse, OrganizationActivity } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserAdd01Icon,
  MailAccount01Icon,
  FolderLibraryIcon,
} from '@hugeicons/core-free-icons';
import { timeAgo } from '@/lib/utils';

type OrganizationActivityResponse = {
  activities: OrganizationActivity[];
};

const fetchOrganizationRecentActivities = async (
  organizationId: string,
): Promise<ApiResponse<OrganizationActivityResponse>> => {
  const { data } =
    await OrganizationService.getOrganizationRecentActivity(organizationId);
  return data;
};

const ACTIVITY_ICON = {
  member_joined: { icon: UserAdd01Icon, className: 'bg-accent/10 text-accent' },
  invitation_sent: {
    icon: MailAccount01Icon,
    className: 'bg-blue-500/10 text-blue-400',
  },
  project_created: {
    icon: FolderLibraryIcon,
    className: 'bg-purple-500/10 text-purple-400',
  },
} satisfies Record<
  OrganizationActivity['type'],
  {
    icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
    className: string;
  }
>;

function ActivityRow({ activity }: { activity: OrganizationActivity }) {
  const { icon, className } = ACTIVITY_ICON[activity.type];

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}
      >
        <HugeiconsIcon icon={icon} size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-200">{activity.text}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {timeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default function OrganizationRecentActivities({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    isPending,
    error,
    data: recentActivitiesData,
  } = useQuery({
    queryKey: ['organization-recent-activities', organizationId],
    queryFn: () => fetchOrganizationRecentActivities(organizationId),
    enabled: !!organizationId,
  });

  const activities = recentActivitiesData?.data?.activities;

  if (isPending) {
    return (
      <div className="border border-white/8 bg-white/3 p-4">
        <p className="text-sm font-medium text-white mb-1">Recent activity</p>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !activities) {
    return (
      <div className="border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-white mb-1">Recent activity</p>
        <p className="text-xs text-red-400/70">
          Couldn&apos;t load recent activity
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="border border-white/8 bg-white/3 p-4">
        <p className="text-sm font-medium text-white mb-1">Recent activity</p>
        <p className="text-xs text-gray-500">No recent activity yet</p>
      </div>
    );
  }

  return (
    <div className="border border-white/8 bg-white/3 p-4">
      <p className="text-sm font-medium text-white mb-1">Recent activity</p>
      <div className="divide-y divide-white/8">
        {activities.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
