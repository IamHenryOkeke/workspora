'use client';

import { Member } from '@/lib/types';
import RemoveMemberModal from './remove-member';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import EditMemberModal from './edit-member';

export default function MemberActions({ member }: { member: Member }) {
  const canManage = useCanManageOrganization();
  if (!canManage) return null;

  return (
    <div className="flex items-center gap-1.5">
      <EditMemberModal member={member} />
      <RemoveMemberModal member={member} />
    </div>
  );
}
