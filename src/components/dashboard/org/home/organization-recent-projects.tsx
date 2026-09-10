'use client';

import { ApiResponse, Project } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { ProjectService } from '@/services/project';
import { timeAgo } from '@/lib/utils';
import { STATUS_ICON, STATUS_LABEL } from '../project-status';

type Projects = {
  projects: Project[];
};

const fetchOrganizationRecentProjects = async (
  organizationId: string,
): Promise<ApiResponse<Projects>> => {
  const { data } = await ProjectService.getProjects({ organizationId });
  return data;
};

function ProjectRow({ project }: { project: Project }) {
  const { icon, className } = STATUS_ICON[project.status];

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}
      >
        <HugeiconsIcon icon={icon} size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-200">
            {project.name}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${className}`}
          >
            {STATUS_LABEL[project.status]}
          </span>
        </div>
        {project.description && (
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {project.description}
          </p>
        )}
        <p className="mt-0.5 text-xs text-gray-500">
          {project.creator ? `${project.creator.fullName} · ` : ''}
          {timeAgo(project.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function OrganizationRecentProjects({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    isPending,
    error,
    data: recentProjectsData,
  } = useQuery({
    queryKey: ['organization-recent-project', organizationId],
    queryFn: () => fetchOrganizationRecentProjects(organizationId),
    enabled: !!organizationId,
  });

  const projects = recentProjectsData?.data?.projects;

  if (isPending) {
    return (
      <div className="border border-white/8 bg-white/3 divide-y divide-white/8">
        <p className="text-sm font-medium text-white p-4">Recent projects</p>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !projects) {
    return (
      <div className="border border-red-500/20 bg-red-500/5 divide-y divide-white/8">
        <p className="text-sm font-medium text-white p-4">Recent projects</p>
        <p className="text-xs text-red-400/70 p-4">
          Couldn&apos;t load recent projects
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="border border-white/8 bg-white/3 divide-y divide-white/8">
        <p className="text-sm font-medium text-white p-4">Recent projects</p>
        <p className="text-xs text-gray-500 p-4">No recent projects yet</p>
      </div>
    );
  }

  return (
    <div className="border border-white/8 bg-white/3 divide-y divide-white/8">
      <p className="text-sm font-medium text-white p-4">Recent projects</p>
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  );
}
