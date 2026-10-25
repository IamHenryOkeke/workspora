'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { OrganizationRole, ProjectMember } from '@/lib/types';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';
import { ProjectMemberService } from '@/services/project-member';
import { ConfirmModal } from '@/components/dashboard/modal';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const [open, setOpen] = useState(false);
  const canManage = useCanManageOrganization();
  const currentRole = useCurrentOrganizationRole();
  const queryClient = useQueryClient();
  const {
    id,
    projectId,
    member: { role, organizationId },
  } = member;
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ProjectMemberService.removeProjectMember(id, projectId, organizationId),
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['project', projectId, organizationId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project-members', projectId, organizationId],
        }),
        toast.success(res.data.message),
      ]);
    },
  });

  const outranksTarget = currentRole.role
    ? ROLE_RANK[currentRole.role as OrganizationRole] > ROLE_RANK[role]
    : false;

  const canRemove = canManage && isProjectMember && outranksTarget;
  if (!canRemove) return null;

  return (
    <>
      <Button
        variant="destructive"
        disabled={isPending}
        onClick={() => setOpen(!open)}
      >
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Remove Project Member?"
        description="You'll need add them again for them to have access."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
}
