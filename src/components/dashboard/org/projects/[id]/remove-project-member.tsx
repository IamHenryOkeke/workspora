'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { OrganizationRole, ProjectMember } from '@/lib/types';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';
import { ProjectMemberService } from '@/services/project-member';

const ROLE_RANK: Record<OrganizationRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

type RemoveMemberProps = {
  member: ProjectMember;
  isProjectMember: boolean;
};

export default function RemoveProjectMember({
  member,
  isProjectMember,
}: RemoveMemberProps) {
  const canManage = useCanManageOrganization();
  const currentRole = useCurrentOrganizationRole();
  const queryClient = useQueryClient();
  const {
    id,
    projectId,
    member: { role, organizationId },
  } = member;
  console.log(member);
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ProjectMemberService.removeProjectMember(id, projectId, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId],
      });
    },
  });

  const outranksTarget = currentRole.role
    ? ROLE_RANK[currentRole.role as OrganizationRole] > ROLE_RANK[role]
    : false;

  const canRemove = canManage && isProjectMember && outranksTarget;
  if (!canRemove) return null;

  return (
    <Button variant="ghost" disabled={isPending} onClick={() => mutate()}>
      {isPending ? 'Removing...' : 'Remove'}
    </Button>
  );
}
