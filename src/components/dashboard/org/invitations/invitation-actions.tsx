'use client';

import { Invitation } from '@/lib/types';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import ResendInvitation from './resend-invitation';
import RevokeInvitation from './revoke-invitation';

export default function InvitationActions({
  invitation,
}: {
  invitation: Invitation;
}) {
  const canManage = useCanManageOrganization();
  if (!canManage) return null;

  return (
    <div className="flex items-center gap-1.5">
      <ResendInvitation invitation={invitation} />
      <RevokeInvitation invitation={invitation} />
    </div>
  );
}
