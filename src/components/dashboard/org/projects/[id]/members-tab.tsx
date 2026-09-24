import { ProjectMember } from '@/lib/types';
import RoleBadge from '@/components/dashboard/role-badge';
import RemoveMember from './remove-member';
import { useAuthStore } from '@/stores/auth-store';
import UserAvatar from '@/components/user-avatar';

export default function MembersTab({ members }: { members: ProjectMember[] }) {
  const { user } = useAuthStore();
  const userId = user?.id;

  const isProjectMember = members.some(
    (member) => member.member.user.id === userId,
  );
  return (
    <div className="border border-white/8">
      <ul className="divide-y divide-white/8">
        <li className="p-4">Assigned ({members.length})</li>
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between gap-3 p-4"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                name={member.member.user.fullName}
                email={member.member.user.email}
                image={member.member.user.avatar}
                className="h-7 w-7"
              />
              <span className="text-sm text-white">
                {member.member.user.fullName}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <RoleBadge role={member.member.role} />
              <RemoveMember
                memberId={member.id}
                projectId={member.projectId}
                isProjectMember={isProjectMember}
                targetRole={member.member.role}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
