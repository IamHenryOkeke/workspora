'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { ReceivedInvitation } from '@/lib/types';
import { getEffectiveStatus } from '@/lib/utils';
import { InvitationService } from '@/services/invitation';
import { useOrganizationStore } from '@/stores/org-store';
import { ConfirmModal } from '../modal';

// Only a live, unexpired invite can be accepted
const canAccept = (invitation: ReceivedInvitation) =>
  getEffectiveStatus(invitation) === 'PENDING';

export default function AcceptInvitation({
  invitation,
}: {
  invitation: ReceivedInvitation;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id, organization } = invitation;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await InvitationService.acceptInvitation(id);
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || `You joined ${organization.name}`);
      setOpen(false);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-invitations'] }),
        queryClient.invalidateQueries({ queryKey: ['organizations'] }),
      ]);

      // The sidebar reads its own copy of the list from Zustand. Refresh it
      // before navigating so the new org is there when the sidebar renders.
      await useOrganizationStore.getState().fetchOrganizations();

      router.push(`/dashboard/org/${organization.slug}/home`);
    },
    onError: async (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to accept invitation',
      );
      // The invite may have expired or been revoked in the meantime
      await queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
    },
  });

  if (!canAccept(invitation)) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="text-accent hover:text-accent"
        onClick={() => setOpen(true)}
      >
        Accept
      </Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Join ${organization.name}?`}
        description={`You'll become a ${invitation.role.toLowerCase()} of ${organization.name} and get access to its projects and members.`}
        confirmLabel="Accept Invitation"
        variant="default"
        isLoading={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
}
