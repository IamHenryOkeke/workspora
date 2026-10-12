'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiResponse, PaginationType, Invitation } from '@/lib/types';
import { getEffectiveStatus } from '@/lib/utils';
import LogoutButton from '@/components/logout-button';
import BackButton from '../org/back-button';
import { DataTable } from '../data-table';
import { invitationColumns } from './invitation-columns';
import { UserService } from '@/services/user';

type MyInvitationsResponse = {
  invitations: Invitation[];
  pagination: PaginationType;
};

const fetchMyInvitations = async (): Promise<
  ApiResponse<MyInvitationsResponse>
> => {
  const { data } = await UserService.getInvitations();
  return data;
};

const EMPTY_INVITATIONS: Invitation[] = [];

export default function InvitationsHome() {
  const { data, isPending, error } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: fetchMyInvitations,
  });

  const invitations = data?.data?.invitations ?? EMPTY_INVITATIONS;

  const pendingCount = invitations.filter(
    (invitation) => getEffectiveStatus(invitation) === 'PENDING',
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <BackButton title="Go back" />
        <LogoutButton />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white">Invitations</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isPending ? (
            <span className="inline-block h-4 w-40 animate-pulse rounded bg-white/5 align-middle" />
          ) : (
            `${pendingCount} pending ${pendingCount === 1 ? 'invitation' : 'invitations'}`
          )}
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-md bg-white/5" />
          ))}
        </div>
      )}

      {!isPending && error && !data && (
        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load your invitations
          </p>
          <p className="mt-1 text-xs text-red-400/70">{error.message}</p>
        </div>
      )}

      {!isPending && !error && invitations.length === 0 && (
        <div className="rounded-md border border-dashed border-white/15 px-6 py-16 text-center">
          <h3 className="text-base font-semibold text-white">
            No invitations yet
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            When someone invites you to an organization, it will show up here.
          </p>
        </div>
      )}

      {!isPending && invitations.length > 0 && (
        <DataTable data={invitations} columns={invitationColumns} />
      )}
    </div>
  );
}
