'use client';

import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UserService } from '@/services/user';
import { updateProfileSchema } from '@/lib/schemas';
import { User, ApiResponse } from '@/lib/types';
import PhoneVerification from './phone-verification';
import UserAvatar from '@/components/user-avatar';
import { useAuthStore } from '@/stores/auth-store';

type ProfileFormType = z.infer<typeof updateProfileSchema>;

const updateProfile = async (
  payload: ProfileFormType,
): Promise<ApiResponse<{ user: User }>> => {
  const formData = new FormData();
  formData.append('fullName', payload.fullName);
  if (payload.avatar) formData.append('avatar', payload.avatar);

  const { data } = await UserService.updateProfile(formData);
  return data;
};

const labelClass = 'text-xs uppercase tracking-wider text-muted-foreground';

export default function ProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthStore();
  const {
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    formState: { isDirty },
  } = useForm<ProfileFormType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      avatar: undefined,
    },
  });

  // Local preview of a newly selected avatar
  const avatarFile = watch('avatar');
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!avatarFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      toast.success(data.message || 'Profile updated');
      const updated = data.data?.user;

      reset({
        fullName: updated?.fullName ?? user.fullName,
        avatar: undefined,
      });

      if (updated) setUser(updated);

      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const avatarSrc = preview ?? user.avatar ?? null;

  const onSubmit = (data: ProfileFormType) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-5 rounded-md border p-6">
      <h2 className={labelClass}>Personal information</h2>

      <form
        id="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Avatar */}
        <Controller
          name="avatar"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-md border bg-muted text-lg font-medium">
                  <UserAvatar
                    name={user.fullName}
                    image={avatarSrc}
                    email={user.email}
                    className="size-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mutation.isPending}
                >
                  Change avatar
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
                    void trigger('avatar'); // validate type and size right away
                    e.target.value = ''; // lets the same file be re-selected
                  }}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Full name */}
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fullName" className={labelClass}>
                Full name
              </FieldLabel>
              <Input
                {...field}
                id="fullName"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email: read-only, it is the login identity and the invitation match */}
        <Field>
          <FieldLabel htmlFor="email" className={labelClass}>
            Email
          </FieldLabel>
          <Input id="email" value={user.email} readOnly disabled />
        </Field>
      </form>

      {/* Phone number: saved only after the user proves they own it */}
      <PhoneVerification user={user} />

      <div>
        <Button
          type="submit"
          form="profile-form"
          disabled={!isDirty || mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
