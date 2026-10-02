'use client';

import { useQuery } from '@tanstack/react-query';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import { ApiResponse, Invitation, PaginationType } from '@/lib/types';
import { InvitationService } from '@/services/invitation';
import { DataTable } from '../../data-table';
import InviteMemberModal from '../members/invite-member';
import { invitationColumns } from './invitation-columns';

type InvitationsResponse = {
  invitations: Invitation[];
  pagination: PaginationType;
};

const fetchOrganizationInvitations = async (
  organizationId: string,
): Promise<ApiResponse<InvitationsResponse>> => {
  const { data } = await InvitationService.getInvitations(organizationId);
  return data;
};

const EMPTY_INVITATIONS: Invitation[] = [];

export default function InvitationHome({ slug }: { slug: string }) {
  const {
    organization,
    isPending: isOrgPending,
    isNotFound,
  } = useGetOrganization(slug);
  const canManage = useCanManageOrganization();

  const title = organization ? `Invitations | ${organization.name}` : 'Loading';
  usePageTitle(title);

  const organizationId = organization?.id ?? '';

  const {
    isPending: isInvitationsPending,
    error,
    data,
  } = useQuery({
    queryKey: ['invitations', organizationId],
    queryFn: () => fetchOrganizationInvitations(organizationId),
    enabled: !!organizationId,
  });

  const invitations = data?.data?.invitations ?? EMPTY_INVITATIONS;
  const pagination = data?.data?.pagination;
  const count = pagination?.total ?? invitations.length;

  const isPending = isOrgPending || isInvitationsPending;

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
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white">Invitations</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isPending ? (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-white/5 align-middle" />
            ) : (
              `${count} ${count === 1 ? 'invitation' : 'invitations'} sent`
            )}
          </p>
        </div>
        {canManage && <InviteMemberModal organizationId={organizationId} />}
      </div>

      {!isPending && error && !data && (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load invitations
          </p>
        </div>
      )}

      <DataTable data={invitations} columns={invitationColumns} />
    </div>
  );
}
