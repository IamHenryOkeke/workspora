'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '../../modal';
import { OrganizationService } from '@/services/organization';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role'; // adjust to your hook
import { useOrganizationStore } from '@/stores/org-store';
import { ApiResponse, Organization } from '@/lib/types';

const leaveOrganization = async (
  organizationId: string,
): Promise<ApiResponse> => {
  const { data } = await OrganizationService.leaveOrganization(organizationId);
  return data;
};

export default function LeaveOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const { role } = useCurrentOrganizationRole();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const leaveMutation = useMutation({
    mutationFn: () => leaveOrganization(organization.id),
    onSuccess: (data) => {
      toast.success(data.message || 'You left the organization');

      const store = useOrganizationStore.getState();
      const next = store.organizations.find(
        (org) => org.id !== organization.id,
      );

      router.replace(
        next ? `/dashboard/org/${next.slug}/home` : '/dashboard/org',
      );
      store.removeOrganization(organization.id);
      void queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to leave organization',
      );
    },
  });

  if (!role || role === 'OWNER') return null;

  return (
    <section className="mt-8 max-w-2xl rounded-md border p-6">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
        Leave organization
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        You&apos;ll lose access to this organization&apos;s projects and members
        right away. You&apos;ll need a new invitation to rejoin.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-5"
        onClick={() => setOpen(true)}
      >
        Leave organization
      </Button>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Leave ${organization.name}?`}
        description="You'll lose access immediately and will need a new invitation to rejoin."
        confirmLabel="Leave organization"
        variant="destructive"
        isLoading={leaveMutation.isPending}
        onConfirm={() => leaveMutation.mutate()}
      />
    </section>
  );
}
