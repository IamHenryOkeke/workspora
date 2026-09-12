'use client';

import { ApiResponse, Project, ProjectStatusFilter } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ProjectService } from '@/services/project';
import { STATUS_LABEL } from '../project-status';
import AppTabs from '../../app-tabs';
import { useGetOrganization } from '@/hooks/use-get-organization';
import AddProject from './add-project';
import ProjectStatus from './project-status';

type ProjectsResponse = {
  projects: Project[];
};

const fetchProjects = async (
  organizationId: string,
  status: ProjectStatusFilter,
): Promise<ApiResponse<ProjectsResponse>> => {
  const { data } = await ProjectService.getProjects({
    organizationId,
    ...(status !== 'ALL' && { status }),
  });
  return data;
};

const FILTERS: { label: string; value: ProjectStatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-teal-500',
];

function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

function MemberAvatarStack({ project }: { project: Project }) {
  const members = project.projectMembers ?? [];
  const visible = members.slice(0, 3);
  const total = project.memberCount ?? members.length;

  if (total === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <div className="flex -space-x-2">
        {visible.map(({ member }) => (
          <div
            key={member.id}
            title={member.user.fullName}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold text-white ${colorForId(
              member.id,
            )}`}
          >
            {initials(member.user.fullName).toUpperCase()}
          </div>
        ))}
      </div>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/10 px-1.5 text-xs font-medium text-gray-300">
        {total}
      </span>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`projects/${project.id}`}
      className="flex items-center justify-between gap-4 border border-white/8 p-5 transition last:border-b-0 bg-white/3"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-white">
            {project.name}
          </h3>
          <ProjectStatus status={project.status} />
        </div>
        {project.description && (
          <p className="mt-1 truncate text-sm text-gray-400">
            {project.description}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Updated {new Date(project.updatedAt).toISOString().slice(0, 10)}
        </p>
      </div>

      <MemberAvatarStack project={project} />
    </Link>
  );
}

export default function ProjectsPage({
  status,
  slug,
}: {
  status: ProjectStatusFilter;
  slug: string;
}) {
  const {
    organization,
    isPending: isOrgPending,
    isNotFound,
  } = useGetOrganization(slug);

  const organizationId = organization?.id ?? '';

  const {
    isPending: isProjectsPending,
    error,
    data,
  } = useQuery({
    queryKey: ['projects', organizationId, status],
    queryFn: () => fetchProjects(organizationId, status),
    enabled: !!organizationId,
  });

  const isPending = isOrgPending || isProjectsPending;

  if (!isOrgPending && isNotFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          This organisation doesn&apos;t exist or you no longer have access.
        </p>
      </div>
    );
  }

  const projects = data?.data?.projects;
  const count = projects?.length ?? 0;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isPending ? (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-white/5 align-middle" />
            ) : (
              `${count} ${count === 1 ? 'project' : 'projects'} in this organization`
            )}
          </p>
        </div>
        <AddProject organizationId={organizationId} />
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <AppTabs tabs={FILTERS} />
        {!isPending && !error && (
          <span className="shrink-0 text-xs text-gray-500">{count} shown</span>
        )}
      </div>

      <div className="">
        {isPending &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-white/8 p-6 last:border-b-0"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-white/5" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/5" />
            </div>
          ))}

        {!isPending && error && (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-red-400">
              Couldn&apos;t load projects
            </p>
          </div>
        )}

        {!isPending && !error && projects && projects.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No{' '}
              {status === 'ALL' ? '' : STATUS_LABEL[status].toLowerCase() + ' '}
              projects yet.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          {!isPending &&
            !error &&
            projects &&
            projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
        </div>
      </div>
    </div>
  );
}
