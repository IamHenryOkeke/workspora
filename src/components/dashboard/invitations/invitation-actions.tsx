'use client';

import { Invitation } from '@/lib/types';
import AcceptInvitation from './accept-invitation';
import DeclineInvitation from './decline-invitation';

export default function InvitationActions({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <AcceptInvitation invitation={invitation} />
      <DeclineInvitation invitation={invitation} />
    </div>
  );
}
