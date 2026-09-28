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
import { ApiResponse } from '@/lib/types';
import Modal from '../../modal';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { createProjectSchema } from '@/lib/schemas';
import { PlusIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type CreateProjectFormType = z.infer<typeof createProjectSchema>;

export type CreateProjectPayloadType = CreateProjectFormType & {
  organizationId: string;
};

const createProject = async (
  payload: CreateProjectPayloadType,
): Promise<ApiResponse> => {
  const { data } = await ProjectService.createProject(payload);
  return data;
};

export default function CreateProjectModal({
  organizationId,
}: {
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);
  const canManage = useCanManageOrganization();
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset } = useForm<CreateProjectFormType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProjectFormType) =>
      createProject({ ...payload, organizationId }),
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

  const onSubmit = (data: CreateProjectFormType) => {
    createProjectMutation.mutate(data);
  };

  return canManage ? (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <HugeiconsIcon icon={PlusIcon} />
          New project
        </Button>
      }
      title="New project"
      className="sm:max-w-md"
      footer={
        <>
          <Button
            type="submit"
            form="new-project-form"
            className="flex-1"
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createProjectMutation.isPending}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id="new-project-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Project name</FieldLabel>
              <Input
                {...field}
                id="name"
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
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="What is this project about?"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </Modal>
  ) : null;
}
