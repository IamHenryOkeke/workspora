'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganisationSchema } from '@/lib/schemas';
import { OrganizationService } from '@/services/organization';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Image01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

type CreateOrganisationData = z.infer<typeof createOrganisationSchema>;

const createOrganisation = async (data: FormData) => {
  const res = await OrganizationService.createOrganization(data);
  return res.data;
};

export default function CreateOrganizationForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { handleSubmit, control, setValue } = useForm<CreateOrganisationData>({
    resolver: zodResolver(createOrganisationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const { mutate, isPending } = useMutation({
    mutationFn: createOrganisation,
    onSuccess: () => {
      toast.success('Organization created successfully');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      router.push('/dashboard/org');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        error.response?.data?.error ||
          'An error occurred during organisation creation',
      );
    },
  });

  const onSubmit = (data: CreateOrganisationData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('logo', data.logo[0]);

    mutate(formData);
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setValue('logo', undefined as unknown as FileList, {
      shouldValidate: true,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Organisation</CardTitle>
        <CardDescription>
          Enter your organisation name below to create your organisation
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => router.back()}>
            Go back
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="create-organisation-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Organisation Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Acme Inc."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Organisation Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. We are a leading provider of innovative solutions."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="logo"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="logo">Organisation Logo</FieldLabel>

                  {logoPreview ? (
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground truncate max-w-50">
                          {field.value?.[0]?.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="flex w-fit items-center gap-1 text-xs text-red-400 hover:text-red-300"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo"
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-6 text-center transition hover:border-white/30 hover:bg-white/5"
                    >
                      <HugeiconsIcon
                        icon={Image01Icon}
                        size={22}
                        className="text-muted-foreground"
                      />
                      <span className="text-xs text-muted-foreground">
                        Click to upload a logo (PNG, JPG)
                      </span>
                    </label>
                  )}

                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    className={logoPreview ? 'hidden' : 'hidden'}
                    onChange={(event) => {
                      const files = event.target.files;
                      field.onChange(files);

                      if (files && files[0]) {
                        if (logoPreview) URL.revokeObjectURL(logoPreview);
                        setLogoPreview(URL.createObjectURL(files[0]));
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="create-organisation-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create Organisation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
