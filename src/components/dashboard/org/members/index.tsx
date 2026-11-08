'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { ApiResponse, Member, PaginationType } from '@/lib/types';
import { MemberService } from '@/services/member';
import { DataTable } from '../../data-table';
import { memberColumns } from './member-columns';
import InviteMemberModal from './invite-member';

type MembersResponse = {
  members: Member[];
  pagination: PaginationType;
};

const fetchOrganizationMembers = async (
  organizationId: string,
): Promise<ApiResponse<MembersResponse>> => {
  const { data } = await MemberService.getMembers(organizationId);
  return data;
};

const EMPTY_MEMBERS: Member[] = [];

export default function MembersHome({ slug }: { slug: string }) {
  const {
    organization,
    isPending: isOrgPending,
    isNotFound,
    error: orgError,
  } = useGetOrganization(slug);
  const canManage = useCanManageOrganization();

  const title = organization ? `Members | ${organization.name}` : 'Loading';
  usePageTitle(title);

  const organizationId = organization?.id ?? '';

  const {
    isPending: isMembersPending,
    error: membersError,
    data,
  } = useQuery({
    queryKey: ['members', organizationId],
    queryFn: () => fetchOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });

  const members = data?.data?.members ?? EMPTY_MEMBERS;
  const pagination = data?.data?.pagination;
  const count = pagination?.total ?? members.length;

  const isPending = isOrgPending || (!!organizationId && isMembersPending);

  const error = membersError ?? orgError;
  const hasLoadError = !isPending && Boolean(error) && !data;

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
          <h1 className="text-2xl font-medium text-white">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isPending ? (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-white/5 align-middle" />
            ) : (
              `${count} ${count === 1 ? 'member' : 'members'} in this organization`
            )}
          </p>
        </div>
        {canManage && !!organizationId && (
          <InviteMemberModal organizationId={organizationId} />
        )}
      </div>

      {hasLoadError && (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load members
          </p>
          <p className="mt-1 text-xs text-red-400/70">
            {(error as AxiosError<{ message: string }>).response?.data
              ?.message ?? error?.message}
          </p>
        </div>
      )}

      {!hasLoadError && (
        <DataTable
          data={members}
          columns={memberColumns}
          isLoading={isPending}
          emptyMessage="No members yet."
        />
      )}
    </div>
  );
}
