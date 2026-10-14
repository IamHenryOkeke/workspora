'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UserService } from '@/services/user';
import { getChangePasswordSchema } from '@/lib/schemas';
import { ApiResponse } from '@/lib/types';
import { PasswordInput } from '@/components/ui/password-input';

type ChangePasswordFormType = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;

const changePassword = async (
  payload: ChangePasswordFormType,
): Promise<ApiResponse> => {
  const { data } = await UserService.changePassword({
    currentPassword: payload.currentPassword || undefined,
    newPassword: payload.newPassword,
  });
  return data;
};

const labelClass = 'text-xs uppercase tracking-wider text-muted-foreground';

const EMPTY_VALUES = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordForm({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const queryClient = useQueryClient();

  const schema = useMemo(
    () => getChangePasswordSchema(hasPassword),
    [hasPassword],
  );

  const { handleSubmit, control, reset, setError } =
    useForm<ChangePasswordFormType>({
      resolver: zodResolver(schema),
      defaultValues: EMPTY_VALUES,
    });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: async (data) => {
      toast.success(
        data.message || (hasPassword ? 'Password changed' : 'Password set'),
      );
      reset(EMPTY_VALUES);
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
      const message =
        error.response?.data?.message || 'Failed to update password';
      if (hasPassword && error.response?.status === 400) {
        setError('currentPassword', { message });
        return;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5 rounded-md border p-6"
      noValidate
    >
      <h2 className={labelClass}>
        {hasPassword ? 'Change password' : 'Set a password'}
      </h2>

      {!hasPassword && (
        <p className="text-sm text-muted-foreground">
          You signed up with Google. Set a password if you also want to log in
          with your email.
        </p>
      )}

      {hasPassword && (
        <Controller
          name="currentPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="currentPassword" className={labelClass}>
                Current password
              </FieldLabel>
              <PasswordInput
                {...field}
                id="currentPassword"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}

      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="newPassword" className={labelClass}>
              New password
            </FieldLabel>
            <PasswordInput
              {...field}
              id="newPassword"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
              placeholder="Min. 8 characters"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword" className={labelClass}>
              Confirm new password
            </FieldLabel>
            <PasswordInput
              {...field}
              id="confirmPassword"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Saving...'
            : hasPassword
              ? 'Update password'
              : 'Set password'}
        </Button>
      </div>
    </form>
  );
}
