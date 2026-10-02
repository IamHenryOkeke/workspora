'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '../../modal';
import { MemberService } from '@/services/member';
import { Member } from '@/lib/types';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';

const removeMember = async (organizationId: string, memberId: string) => {
  const { data } = await MemberService.removeMember(organizationId, memberId);
  return data;
};

export default function RemoveMemberModal({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const { role } = useCurrentOrganizationRole();
  const { id: memberId, organizationId } = member;
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: () => removeMember(organizationId, memberId),
    onSuccess: async (data) => {
      toast.success(data.message || 'Member removed');
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    },
  });

  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN';
  const canRemove =
    (isOwner && (member.role === 'MEMBER' || member.role === 'ADMIN')) ||
    (isAdmin && member.role === 'MEMBER');

  if (!canRemove) return null;

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="ghost">
        Remove
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Remove Member?"
        description="Are you sure you want to remove this member?"
        confirmLabel="Remove Member"
        variant="destructive"
        isLoading={removeMemberMutation.isPending}
        onConfirm={() => removeMemberMutation.mutate()}
      />
    </div>
  );
}
