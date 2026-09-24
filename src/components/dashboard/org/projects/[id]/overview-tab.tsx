import { Project, ProjectMember, ProjectStatusType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { STATUS_BADGE, STATUS_LABEL } from '../../project-status';
import RoleBadge from '@/components/dashboard/role-badge';
import MemberInitial from '../../member-initial';

type OverviewProps = {
  project: Project;
  members: ProjectMember[];
};
export default function OverviewTab({ project, members }: OverviewProps) {
  const { name, status, createdAt, updatedAt } = project;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-white/8 p-6">
        <h2 className="mb-6 text-xs font-medium tracking-wide text-gray-500">
          DETAILS
        </h2>
        <dl className="space-y-5">
          <div>
            <dt className="text-xs text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-white">{name}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-white">{formatDate(createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Last updated</dt>
            <dd className="mt-1 text-sm text-white">{formatDate(updatedAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[status as ProjectStatusType]}`}
              >
                {STATUS_LABEL[status]}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-white/8 p-6">
        <h2 className="mb-6 text-xs font-medium tracking-wide text-gray-500">
          ASSIGNED MEMBERS
        </h2>
        <ul className="space-y-4">
          {members.map((member, i) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <MemberInitial fullName={member.member.user.fullName} i={i} />
                <span className="text-sm text-white">
                  {member.member.user.fullName}
                </span>
              </div>
              <RoleBadge role={member.member.role} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
