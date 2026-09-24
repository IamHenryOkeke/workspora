'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Project, ProjectMember } from '@/lib/types';
import { ProjectService } from '@/services/project';
import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import ProjectStatus from '../project-status';
import { formatDate } from '@/lib/utils';
import OverviewTab from './overview-tab';
import MembersTab from './members-tab';

type ProjectDetailResponse = {
  project: Project;
};

type ProjectMembersResponse = {
  projectMembers: ProjectMember[];
};

const fetchProject = async (
  projectId: string,
  organizationId: string,
): Promise<ApiResponse<ProjectDetailResponse>> => {
  const { data } = await ProjectService.getProjectById(projectId, {
    organizationId,
  });
  return data;
};

const fetchProjectMembers = async (
  projectId: string,
): Promise<ApiResponse<ProjectMembersResponse>> => {
  const { data } = await ProjectService.getProjectMembers(projectId);
  return data;
};

export default function ProjectDetailPage({
  projectId,
  slug,
}: {
  projectId: string;
  slug: string;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>(
    'overview',
  );

  const {
    organization,
    isPending: isOrgPending,
    isNotFound,
  } = useGetOrganization(slug);

  const organizationId = organization?.id ?? '';

  const {
    isPending: isProjectPending,
    error: projectError,
    data,
  } = useQuery({
    queryKey: ['project', projectId, organizationId],
    queryFn: () => fetchProject(projectId, organizationId),
    enabled: !!organizationId,
  });

  const {
    isPending: isProjectMembersPending,
    error: projectMembersError,
    data: projectMembersData,
  } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!organizationId,
  });

  const project = data?.data?.project;
  const members = projectMembersData?.data?.projectMembers ?? [];

  const title =
    project && organization
      ? `${project.name} | Projects | ${organization.name}`
      : 'Loading';
  usePageTitle(title);

  const isPending = isOrgPending || isProjectPending || isProjectMembersPending;
  const hasError = Boolean(projectError || projectMembersError);

  if (!isOrgPending && isNotFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          This organisation doesn&apos;t exist or you no longer have access.
        </p>
      </div>
    );
  }

  return (
    <div>
      {isPending && (
        <div className="mb-8">
          <div className="h-7 w-64 animate-pulse rounded bg-white/5" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-white/5" />
          <div className="mt-3 h-5 w-40 animate-pulse rounded bg-white/5" />
        </div>
      )}

      {!isPending && (hasError || !project) && (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load project
          </p>
        </div>
      )}

      {!isPending && !hasError && project && (
        <>
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-white">
                {project.name}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {project.description}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ProjectStatus status={project.status} />
                <span className="text-xs text-gray-500">
                  Last updated {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-6 border-b border-white/8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-amber-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === 'members'
                  ? 'border-amber-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Members ({members.length})
            </button>
          </div>

          {activeTab === 'overview' && (
            <OverviewTab project={project} members={members} />
          )}

          {activeTab === 'members' && <MembersTab members={members} />}
        </>
      )}
    </div>
  );
}
