'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { ReceivedInvitation } from '@/lib/types';
import { getEffectiveStatus } from '@/lib/utils';
import { InvitationService } from '@/services/invitation';
import { ConfirmModal } from '../modal';

// Only a live, unexpired invite can be declined
const canDecline = (invitation: ReceivedInvitation) =>
  getEffectiveStatus(invitation) === 'PENDING';

export default function DeclineInvitation({
  invitation,
}: {
  invitation: ReceivedInvitation;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id, organization } = invitation;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await InvitationService.declineInvitation(id);
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || 'Invitation declined');
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
    },
    onError: async (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to decline invitation',
      );
      // The invite may have expired or been revoked in the meantime
      await queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
    },
  });

  if (!canDecline(invitation)) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        Decline
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Decline Invitation?"
        description={`You won't join ${organization.name}. They'll need to send a new invitation if you change your mind.`}
        confirmLabel="Decline Invitation"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
}
