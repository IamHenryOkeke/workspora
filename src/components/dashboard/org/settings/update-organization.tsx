'use client';

import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { OrganizationService } from '@/services/organization';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import { updateOrganizationSchema } from '@/lib/schemas';
import { ApiResponse, Organization } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useOrganizationStore } from '@/stores/org-store';

type UpdateOrganizationFormType = z.infer<typeof updateOrganizationSchema>;

const updateOrganization = async (
  organizationId: string,
  payload: UpdateOrganizationFormType,
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('description', payload.description);
  if (payload.logo) formData.append('logo', payload.logo);

  const { data } = await OrganizationService.updateOrganization(
    organizationId,
    formData,
  );
  return data;
};

const labelClass = 'text-xs uppercase tracking-wider text-muted-foreground';

export default function UpdateOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const canManage = useCanManageOrganization();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateOrganization: updateOrg } = useOrganizationStore();

  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const {
    handleSubmit,
    control,
    reset,
    setError,
    trigger,
    watch,
    formState: { isDirty },
  } = useForm<UpdateOrganizationFormType>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name,
      description: organization.description ?? '',
      logo: undefined,
    },
  });

  const logoFile = watch('logo');
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!logoFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationFormType) =>
      updateOrganization(organization.id, payload),
    onSuccess: async (data) => {
      toast.success(data.message || 'Organization updated');
      const {
        name,
        description,
        slug: newSlug,
        logo,
      } = (data.data as { organization: Organization }).organization;

      updateOrg(organization.id, {
        name,
        slug: newSlug,
        description,
        logo,
      });

      reset({ name, description: description ?? '', logo: undefined });

      if (newSlug !== organization.slug) {
        router.replace(
          `/dashboard/org/${newSlug}/settings?active-tab=organization`,
        );
        void queryClient.invalidateQueries({ queryKey: ['organizations'] });
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['organization', organization.slug],
        }),
        queryClient.invalidateQueries({ queryKey: ['organizations'] }),
      ]);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message || 'Failed to update organization';
      if (error.response?.status === 409) {
        setError('name', { message });
        return;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: UpdateOrganizationFormType) =>
    updateMutation.mutate(data);

  if (!canManage) return null;

  const logoSrc = preview ?? organization.logo ?? null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5 rounded-md border p-6"
    >
      <h2 className={labelClass}>Organization profile</h2>

      {/* Logo */}
      <Controller
        name="logo"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-md border bg-muted text-xl font-medium">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={`${organization.name} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  organization.name.charAt(0).toUpperCase()
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateMutation.isPending}
              >
                Upload logo
              </Button>
              <span className="text-sm text-muted-foreground">
                PNG, JPG up to 2MB
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                  void trigger('logo'); // validate type and size right away
                  e.target.value = ''; // lets the same file be re-selected
                }}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name" className={labelClass}>
              Organization name
            </FieldLabel>
            <Input {...field} id="name" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* URL handle: read-only, generated from the name when the org was created */}
      <Field>
        <FieldLabel htmlFor="slug" className={labelClass}>
          URL handle
        </FieldLabel>
        <div className="flex items-stretch overflow-hidden rounded-md border">
          <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground w-1/2">
            {origin ? `${origin}/` : '/'}
          </span>
          <Input
            id="slug"
            value={organization.slug}
            readOnly
            className="rounded-none border-0 focus-visible:ring-0"
          />
        </div>
      </Field>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description" className={labelClass}>
              Description
            </FieldLabel>
            <Input
              {...field}
              id="description"
              aria-invalid={fieldState.invalid}
              placeholder="What does your organization do?"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div>
        <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
