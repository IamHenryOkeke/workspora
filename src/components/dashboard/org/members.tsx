import { ApiResponse, Member, PaginationType } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserGroupIcon } from '@hugeicons/core-free-icons';
import RoleBadge from '../role-badge';
import OrganizationOrUserLogo from '../organization-user-logo';

type MembersResponse = {
  members: Member[];
  pagination: PaginationType;
};

const fetchOrganizationMembers = async (
  organizationId: string,
): Promise<ApiResponse<MembersResponse>> => {
  const { data } =
    await OrganizationService.getOrganizationMembers(organizationId);

  return data;
};

export default function Members({
  organizationId,
}: {
  organizationId: string;
}) {
  const { isPending, error, data } = useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: () => fetchOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });

  const members = data?.data?.members || [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        <div className="flex items-center justify-between border-b border-white/8 p-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Members</h2>

            <p className="mt-1 text-xs text-gray-500">
              {pagination?.total ?? 0}{' '}
              {(pagination?.total ?? 0) === 1 ? 'member' : 'members'}
            </p>
          </div>

          <HugeiconsIcon
            icon={UserGroupIcon}
            size={20}
            className="text-gray-500"
          />
        </div>
      </div>
      {isPending ? (
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />

                <div className="space-y-2">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-44 animate-pulse rounded bg-white/5" />
                </div>
              </div>

              <div className="h-6 w-16 animate-pulse rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load members
          </p>

          <p className="mt-1 text-xs text-red-400/70">{error.message}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-500">
            <HugeiconsIcon icon={UserGroupIcon} size={18} />
          </div>

          <p className="mt-3 text-sm font-medium text-white">
            No members found
          </p>

          <p className="mt-1 text-xs text-gray-500">
            This organisation doesn&apos;t have any members yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <OrganizationOrUserLogo
                  name={member.user.fullName}
                  logo={member.user.avatar}
                  type="user"
                  size={40}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {member.user.fullName}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <RoleBadge role={member.role} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
