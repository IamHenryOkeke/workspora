'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { ApiResponse, Member, PaginationType } from '@/lib/types';
import { MemberService } from '@/services/member';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusIcon } from '@hugeicons/core-free-icons';
import { DataTable } from '../../data-table';
import { memberColumns } from './member-columns';

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

// const getName = (m: Member): string => m.user.fullName ?? '';
// const getEmail = (m: Member): string => m.user.email ?? '';
// const getRole = (m: Member): string => String(m.role ?? '').toUpperCase();
// const getStatus = (m: Member): string => String(m.status ?? '').toUpperCase();

// const BADGE_BASE =
//   'inline-block w-full border px-3 py-1 text-xs font-medium leading-none';

// const ROLE_STYLES: Record<string, string> = {
//   OWNER: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
//   ADMIN: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
//   MEMBER: 'border-white/10 bg-white/5 text-gray-400',
// };

// const STATUS_STYLES: Record<string, string> = {
//   ACTIVE: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
//   PENDING: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
//   INVITED: 'border-white/10 bg-white/5 text-gray-400',
//   SUSPENDED: 'border-red-500/40 bg-red-500/10 text-red-400',
// };

// const FALLBACK_BADGE = 'border-white/10 bg-white/5 text-gray-400';

// const toLabel = (value: string) =>
//   value ? value.charAt(0) + value.slice(1).toLowerCase() : '—';

// const getInitials = (name: string) =>
//   name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join('') || '?';

const EMPTY_MEMBERS: Member[] = [];

export default function MembersHome({ slug }: { slug: string }) {
  const {
    organization,
    isPending: isOrgPending,
    isNotFound,
  } = useGetOrganization(slug);
  const canManage = useCanManageOrganization();

  const title = organization ? `Members | ${organization.name}` : 'Loading';
  usePageTitle(title);

  const organizationId = organization?.id ?? '';

  const {
    isPending: isMembersPending,
    error,
    data,
  } = useQuery({
    queryKey: ['members', organizationId],
    queryFn: () => fetchOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });

  const members = data?.data?.members ?? EMPTY_MEMBERS;
  const pagination = data?.data?.pagination;
  const count = pagination?.total ?? members.length;

  const isPending = isOrgPending || isMembersPending;

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
        {canManage && (
          <Button>
            <HugeiconsIcon icon={PlusIcon} />
            Invite member
          </Button>
        )}
      </div>

      {!isPending && error && !data && (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load members
          </p>
        </div>
      )}

      <DataTable data={members} columns={memberColumns} />
    </div>
  );
}
