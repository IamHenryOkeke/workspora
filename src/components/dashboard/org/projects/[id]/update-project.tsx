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
import { ProjectService } from '@/services/project';
import { ApiResponse, Project } from '@/lib/types';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import Modal from '@/components/dashboard/modal';
import { updateProjectSchema } from '@/lib/schemas';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit04Icon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type UpdateProjectFormType = z.infer<typeof updateProjectSchema>;

export type UpdateProjectPayloadType = UpdateProjectFormType & {
  organizationId: string;
};

const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayloadType,
): Promise<ApiResponse> => {
  const { data } = await ProjectService.updateProject(projectId, payload);
  return data;
};

export default function UpdateProjectModal({
  project,
  organizationId,
}: {
  project: Project;
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);
  const canManage = useCanManageOrganization();
  const queryClient = useQueryClient();

  // `values` (instead of `defaultValues`) keeps the form in sync with the
  // latest project data, so after a successful update and refetch the form
  // reflects the new values rather than the ones from first render.
  const { handleSubmit, control, reset } = useForm<UpdateProjectFormType>({
    resolver: zodResolver(updateProjectSchema),
    values: {
      name: project.name,
      description: project.description ?? '',
      status: project.status ?? '',
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (payload: UpdateProjectFormType) =>
      updateProject(project.id, { ...payload, organizationId }),
    onSuccess: async (data) => {
      toast.success(data.message || 'Project updated');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['project', project.id, organizationId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['projects', organizationId],
        }),
      ]);
      setOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });

  const onSubmit = (data: UpdateProjectFormType) => {
    updateProjectMutation.mutate(data);
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
        <Button>
          <HugeiconsIcon icon={Edit04Icon} />
          Update project
        </Button>
      }
      title="Update project"
      className="sm:max-w-md"
      footer={
        <>
          <Button
            type="submit"
            form="update-project-form"
            className="flex-1"
            disabled={updateProjectMutation.isPending}
          >
            {updateProjectMutation.isPending ? 'Updating...' : 'Update project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateProjectMutation.isPending}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id="update-project-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="update-project-name">
                Project name
              </FieldLabel>
              <Input
                {...field}
                id="update-project-name"
                aria-invalid={fieldState.invalid}
                placeholder="Project name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="update-project-description">
                Description
              </FieldLabel>
              <Input
                {...field}
                id="update-project-description"
                aria-invalid={fieldState.invalid}
                placeholder="What is this project about?"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </form>
    </Modal>
  ) : null;
}
