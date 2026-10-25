'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemberService } from '@/services/member';
import {
  ApiResponse,
  Member,
  PaginationType,
  Project,
  ProjectMember,
} from '@/lib/types';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import Modal from '@/components/dashboard/modal';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusIcon } from '@hugeicons/core-free-icons';
import { extractDetailsMessage } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { assignMembersSchema } from '@/lib/schemas';
import { ProjectMemberService } from '@/services/project-member';

export type AssignMembersFormType = z.infer<typeof assignMembersSchema>;

type MembersResponse = {
  members: Member[];
  pagination: PaginationType;
};

const EMPTY_MEMBERS: Member[] = [];

const fetchOrganizationMembers = async (
  organizationId: string,
): Promise<ApiResponse<MembersResponse>> => {
  const { data } = await MemberService.getMembers(organizationId);
  return data;
};

const assignMembers = async (
  projectId: string,
  organizationId: string,
  payload: AssignMembersFormType,
): Promise<ApiResponse> => {
  const { data } = await ProjectMemberService.createProjectMember(
    projectId,
    organizationId,
    payload,
  );
  return data;
};

export default function AssignMember({
  project,
  assignedMembers,
}: {
  project: Project;
  assignedMembers: ProjectMember[];
}) {
  const organizationId = project.organizationId;
  const [open, setOpen] = useState(false);
  const canManage = useCanManageOrganization();
  const queryClient = useQueryClient();

  const {
    isPending: isMembersPending,
    error: membersError,
    data: membersData,
  } = useQuery({
    queryKey: ['members', organizationId],
    queryFn: () => fetchOrganizationMembers(organizationId),
    enabled: !!organizationId && open,
  });

  const members = membersData?.data?.members ?? EMPTY_MEMBERS;

  const assignedIds = useMemo(
    () => assignedMembers.map((member) => member.member.id),
    [assignedMembers],
  );

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AssignMembersFormType>({
    resolver: zodResolver(assignMembersSchema),
    values: {
      memberIds: assignedIds,
    },
  });

  const assignMembersMutation = useMutation({
    mutationFn: (payload: AssignMembersFormType) =>
      assignMembers(project.id, organizationId, payload),
    onSuccess: async (data) => {
      toast.success(data.message || 'Members assigned');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['project', project.id, organizationId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project-members', project.id, organizationId],
        }),
      ]);
      setOpen(false);
    },
    onError: (
      error: AxiosError<{
        message: string;
        details?: Record<string, string[]>;
      }>,
    ) => {
      const details = error.response?.data?.details;
      const detailMessages = extractDetailsMessage(details);
      toast.error(error.response?.data?.message || 'Failed to assign members', {
        description: detailMessages.length
          ? detailMessages.join('. ')
          : 'Please try again.',
      });
    },
  });

  const onSubmit = (data: AssignMembersFormType) => {
    assignMembersMutation.mutate(data);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  return canManage ? (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button variant="link" className="text-accent hover:no-underline">
          <HugeiconsIcon icon={PlusIcon} />
          Assign member
        </Button>
      }
      title="Assign members"
      className="sm:max-w-md"
      footer={
        <>
          <Button
            type="submit"
            form="assign-members-form"
            className="flex-1"
            disabled={assignMembersMutation.isPending || isMembersPending}
          >
            {assignMembersMutation.isPending
              ? 'Assigning to project...'
              : 'Assign to project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={assignMembersMutation.isPending}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id="assign-members-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FieldSet>
          <FieldLegend variant="label">Members</FieldLegend>
          <FieldDescription>
            Select the members you want to assign to this project.
          </FieldDescription>
          {isMembersPending ? (
            <p className="text-sm text-muted-foreground">Loading members...</p>
          ) : membersError && !membersData ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load members
            </p>
          ) : (
            <Controller
              name="memberIds"
              control={control}
              render={({ field }) => (
                <ScrollArea className="h-64 rounded-md border p-3">
                  <FieldGroup className="gap-3">
                    {members.map((member) => {
                      const checkboxId = `member-${member.id}`;
                      const checked = field.value.includes(member.id);
                      return (
                        <Field key={member.id} orientation="horizontal">
                          <Checkbox
                            id={checkboxId}
                            checked={checked}
                            onCheckedChange={(value) =>
                              field.onChange(
                                value
                                  ? [...field.value, member.id]
                                  : field.value.filter(
                                      (id) => id !== member.id,
                                    ),
                              )
                            }
                          />
                          <FieldLabel
                            htmlFor={checkboxId}
                            className="font-normal"
                          >
                            {member.user.fullName}
                            {member.user.email ? (
                              <span className="text-muted-foreground">
                                {' '}
                                {member.user.email}
                              </span>
                            ) : null}
                          </FieldLabel>
                        </Field>
                      );
                    })}
                  </FieldGroup>
                </ScrollArea>
              )}
            />
          )}
          {errors.memberIds ? (
            <p className="text-sm text-destructive">
              {errors.memberIds.message}
            </p>
          ) : null}
        </FieldSet>
      </form>
    </Modal>
  ) : null;
}
