import { ProjectMember } from '@/lib/types';
import MemberInitial from '../../member-initial';
import RoleBadge from '@/components/dashboard/role-badge';
import RemoveMember from './remove-member';

export default function MembersTab({ members }: { members: ProjectMember[] }) {
  return (
    <div className="border border-white/8">
      <ul className="divide-y divide-white/8">
        <li className="p-4">Assigned ({members.length})</li>
        {members.map((member, i) => (
          <li
            key={member.id}
            className="flex items-center justify-between gap-3 p-4"
          >
            <div className="flex items-center gap-3">
              <MemberInitial fullName={member.member.user.fullName} i={i} />
              <span className="text-sm text-white">
                {member.member.user.fullName}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <RoleBadge role={member.member.role} />
              <RemoveMember id={member.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
