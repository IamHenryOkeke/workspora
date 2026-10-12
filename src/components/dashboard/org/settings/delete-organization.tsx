'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import Modal from '../../modal';
import { OrganizationService } from '@/services/organization';
import { ApiResponse, Organization } from '@/lib/types';
import { useOrganizationStore } from '@/stores/org-store';

const deleteOrganization = async (
  organizationId: string,
): Promise<ApiResponse> => {
  const { data } = await OrganizationService.deleteOrganization(organizationId);
  return data;
};

export default function DeleteOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganization(organization.id),
    onSuccess: (data) => {
      toast.success(data.message || 'Organization deleted');

      const store = useOrganizationStore.getState();
      const next = store.organizations.find(
        (org) => org.id !== organization.id,
      );

      router.replace(
        next ? `/dashboard/org/${next.slug}/home` : '/dashboard/org',
      );
      store.removeOrganization(organization.id);
      void queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete organization',
      );
    },
  });

  const isMatch = confirmText === organization.name;

  const handleOpenChange = (next: boolean) => {
    if (deleteMutation.isPending) return;
    setOpen(next);
    if (!next) setConfirmText('');
  };

  return (
    <section className="max-w-2xl rounded-md border border-red-500/30 bg-red-500/5 p-6">
      <h2 className="text-xs uppercase tracking-wider text-red-400">
        Danger zone
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Permanently delete this organization and all its data. This action
        cannot be undone.
      </p>

      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        trigger={
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            Delete organization
          </Button>
        }
        title="Delete organization"
        className="sm:max-w-md"
        footer={
          <>
            <Button
              type="submit"
              form="delete-organization-form"
              variant="destructive"
              className="flex-1"
              disabled={!isMatch || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete organization'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
          </>
        }
      >
        <form
          id="delete-organization-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (isMatch) deleteMutation.mutate();
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-muted-foreground">
            This will permanently delete <strong>{organization.name}</strong>,
            including its projects, members, and pending invitations. Members
            will lose access immediately.
          </p>

          <Field>
            <FieldLabel htmlFor="confirm-name">
              Type <strong>{organization.name}</strong> to confirm
            </FieldLabel>
            <Input
              id="confirm-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              disabled={deleteMutation.isPending}
              placeholder={organization.name}
            />
          </Field>
        </form>
      </Modal>
    </section>
  );
}
