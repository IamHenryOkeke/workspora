import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Invitation } from '@/lib/types';
import { InvitationService } from '@/services/invitation';
import { ConfirmModal } from '../../modal';
import { getEffectiveStatus } from '@/lib/utils';

const canResend = (invitation: Invitation) =>
  getEffectiveStatus(invitation) === 'EXPIRED';

export default function ResendInvitation({
  invitation,
}: {
  invitation: Invitation;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id, organizationId } = invitation;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await InvitationService.resendInvitation(
        organizationId,
        id,
      );
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || 'Invitation resent');
      await queryClient.invalidateQueries({
        queryKey: ['invitations', organizationId],
      });
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to resend invitation',
      );
    },
  });

  if (!canResend(invitation)) return null;

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        Resend
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Resend Invitation?"
        description="Are you sure you want to resend this invitation?"
        confirmLabel="Resend Invitation"
        variant="default"
        isLoading={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
}
