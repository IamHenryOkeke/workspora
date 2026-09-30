'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserAvatar from '@/components/user-avatar';
import { ApiResponse, Member } from '@/lib/types';
import { editMemberSchema } from '@/lib/schemas';
import { MemberService } from '@/services/member';
import Modal from '../../modal';
import RoleBadge, { ROLE_LABELS } from '../../role-badge';
import MemberStatusBadge from '../../member-status';
import { useState } from 'react';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';

type EditMemberFormType = z.infer<typeof editMemberSchema>;
export type EditMemberPayload = Partial<EditMemberFormType>;

const updateMember = async (
  organizationId: string,
  memberId: string,
  payload: EditMemberPayload,
): Promise<ApiResponse> => {
  const { data } = await MemberService.updateMember(
    organizationId,
    memberId,
    payload,
  );
  return data;
};

export default function EditMemberModal({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { role } = useCurrentOrganizationRole();

  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN';
  const statusIsEditable =
    member.status === 'ACTIVE' || member.status === 'SUSPENDED';

  const canEditRole = isOwner;
  const canEditStatus =
    statusIsEditable &&
    ((isOwner && member.role !== 'OWNER') ||
      (isAdmin && member.role === 'MEMBER'));
  const nothingEditable = !canEditRole && !canEditStatus;

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty, dirtyFields },
  } = useForm<EditMemberFormType>({
    resolver: zodResolver(editMemberSchema),
    values: {
      role: member.role,
      status: statusIsEditable
        ? (member.status as 'ACTIVE' | 'SUSPENDED')
        : undefined,
    },
  });

  const selectedStatus = watch('status');

  const updateMemberMutation = useMutation({
    mutationFn: (payload: EditMemberPayload) =>
      updateMember(member.organizationId, member.id, payload),
    onSuccess: async (data) => {
      toast.success(data.message || 'Member updated');
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  const onSubmit = (data: EditMemberFormType) => {
    const payload: EditMemberPayload = {};
    if (canEditRole && dirtyFields.role) payload.role = data.role;
    if (canEditStatus && dirtyFields.status) payload.status = data.status;

    if (Object.keys(payload).length === 0) {
      setOpen(false);
      return;
    }
    updateMemberMutation.mutate(payload);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  const { fullName, email, avatar } = member.user;

  if (!nothingEditable) return null;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Member"
      className="sm:max-w-md"
      trigger={
        <Button onClick={() => setOpen(true)} variant="ghost">
          Edit
        </Button>
      }
      footer={
        <>
          <Button
            type="submit"
            form="edit-member-form"
            className="flex-1"
            disabled={
              !isDirty || nothingEditable || updateMemberMutation.isPending
            }
          >
            {updateMemberMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateMemberMutation.isPending}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id="edit-member-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            name={fullName}
            email={email}
            image={avatar}
            className="h-9 w-9"
          />
          <div className="flex flex-col">
            <span className="text-sm text-white">{fullName}</span>
            <span className="text-sm text-white/50">{email}</span>
          </div>
        </div>

        {canEditRole ? (
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        ) : (
          <Field>
            <FieldLabel>Role</FieldLabel>
            <div>
              <RoleBadge role={member.role} />
            </div>
            <FieldDescription>Only owners can change roles.</FieldDescription>
          </Field>
        )}

        {/* Status */}
        {statusIsEditable ? (
          canEditStatus ? (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          ) : (
            <Field>
              <FieldLabel>Status</FieldLabel>
              <div>
                <MemberStatusBadge status={member.status} />
              </div>
              <FieldDescription>
                You can&apos;t change an {ROLE_LABELS[member.role]}&apos;s
                status
              </FieldDescription>
            </Field>
          )
        ) : (
          <Field>
            <FieldLabel>Status</FieldLabel>
            <div>
              <MemberStatusBadge status={member.status} />
            </div>
            <FieldDescription>Managed from Invitations.</FieldDescription>
          </Field>
        )}

        {selectedStatus === 'SUSPENDED' && member.status !== 'SUSPENDED' && (
          <div className="bg-accent/10 text-white/30 border border-accent/30 p-2.5">
            Suspended members lose access to this organization until you
            reactivate them.
          </div>
        )}
      </form>
    </Modal>
  );
}
