'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { OrganizationRole } from '@/lib/types';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';
import { ProjectMemberService } from '@/services/project-member';

const ROLE_RANK: Record<OrganizationRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

type RemoveMemberProps = {
  memberId: string;
  projectId: string;
  isProjectMember: boolean;
  targetRole: OrganizationRole;
};

export default function RemoveMember({
  memberId,
  projectId,
  isProjectMember,
  targetRole,
}: RemoveMemberProps) {
  const canManage = useCanManageOrganization();
  const currentRole = useCurrentOrganizationRole();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ProjectMemberService.removeProjectMember(projectId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId],
      });
    },
  });

  const outranksTarget = currentRole.role
    ? ROLE_RANK[currentRole.role as OrganizationRole] > ROLE_RANK[targetRole]
    : false;

  const canRemove = canManage && isProjectMember && outranksTarget;
  if (!canRemove) return null;

  return (
    <Button variant="ghost" disabled={isPending} onClick={() => mutate()}>
      {isPending ? 'Removing...' : 'Remove'}
    </Button>
  );
}
