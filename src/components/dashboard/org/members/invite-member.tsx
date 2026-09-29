'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { ApiResponse } from '@/lib/types';
import Modal from '../../modal';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { inviteMemberSchema } from '@/lib/schemas';
import { PlusIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { InvitationService } from '@/services/invitation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type InviteMemberFormType = z.infer<typeof inviteMemberSchema>;

const inviteMember = async (
  organizationId: string,
  payload: InviteMemberFormType,
): Promise<ApiResponse> => {
  const { data } = await InvitationService.inviteMember(
    organizationId,
    payload,
  );
  return data;
};

export default function InviteMemberModal({
  organizationId,
}: {
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);
  const canManage = useCanManageOrganization();
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset } = useForm<InviteMemberFormType>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (payload: InviteMemberFormType) =>
      inviteMember(organizationId, payload),
    onSuccess: async (data) => {
      toast.success(data.message || 'Project created');
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      reset();
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  const onSubmit = (data: InviteMemberFormType) => {
    inviteMemberMutation.mutate(data);
  };

  return canManage ? (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <HugeiconsIcon icon={PlusIcon} />
          Invite Member
        </Button>
      }
      title="Invite Member"
      className="sm:max-w-md"
      footer={
        <>
          <Button
            type="submit"
            form="invite-member-form"
            className="flex-1"
            disabled={inviteMemberMutation.isPending}
          >
            {inviteMemberMutation.isPending
              ? 'Sending Invitation...'
              : 'Send Invitation'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={inviteMemberMutation.isPending}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id="invite-member-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="johndoe@gmail.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="role">Status</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="bg-accent/10 text-white/30 border border-accent/30 p-2.5">
          An invitation email will be sent. The link expires in 7 days.
        </div>
      </form>
    </Modal>
  ) : null;
}
