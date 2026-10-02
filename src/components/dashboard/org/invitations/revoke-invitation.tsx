import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Invitation } from '@/lib/types';
import { InvitationService } from '@/services/invitation';
import { ConfirmModal } from '../../modal';
import { getEffectiveStatus } from '@/lib/utils';

// Only a live, unexpired invite can be revoked
const canRevoke = (invitation: Invitation) =>
  getEffectiveStatus(invitation) === 'PENDING';

export default function RevokeInvitation({
  invitation,
}: {
  invitation: Invitation;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id, organizationId } = invitation;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await InvitationService.revokeInvitation(
        organizationId,
        id,
      );
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || 'Invitation revoked');
      await queryClient.invalidateQueries({
        queryKey: ['invitations', organizationId],
      });
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to revoke invitation',
      );
    },
  });

  if (!canRevoke(invitation)) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        Revoke
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Revoke Invitation?"
        description="The invite link will stop working and the recipient will no longer be able to join. This can't be undone, but you can send a new invitation later."
        confirmLabel="Revoke Invitation"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
}
