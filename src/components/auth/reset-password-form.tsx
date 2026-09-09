'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTogglePasswordVisibity } from '@/hooks/use-toggle-password-visibility';
import { Eye, EyeOff } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from '@/lib/types';
import { AuthService } from '@/services/auth';
import { AxiosError } from 'axios';
import { useState } from 'react';
import CardWrapper from './card-wrapper';

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        error: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordPayload = z.infer<typeof updatePasswordSchema>;

const resetPassword = async (payload: {
  password: string;
  token: string;
}): Promise<ApiResponse> => {
  const { data } = await AuthService.resetPassword(payload);
  return data;
};

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { showPassword, togglePasswordVisibity } = useTogglePasswordVisibity();

  const { handleSubmit, control, formState } = useForm<
    z.infer<typeof updatePasswordSchema>
  >({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      toast.success(res.message || 'Password reset successfully');
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errMessage = error.response?.data?.message;
      toast.error(errMessage || 'An error occurred');
    },
  });

  const onSubmit = (data: ResetPasswordPayload) => {
    const payload = {
      password: data.password,
      token,
    };
    resetPasswordMutation.mutate(payload);
  };

  const isSubmitting =
    resetPasswordMutation.isPending || isRedirecting || formState.isSubmitting;

  return (
    <CardWrapper
      title="Reset Your Password"
      description="Enter your new password below to reset your password."
      footerChildren={
        <p className="text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div>
        <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibity}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <HugeiconsIcon icon={EyeOff} size={20} />
                      ) : (
                        <HugeiconsIcon icon={Eye} size={20} />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibity}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                    >
                      {showPassword ? (
                        <HugeiconsIcon icon={EyeOff} size={20} />
                      ) : (
                        <HugeiconsIcon icon={Eye} size={20} />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="reset-password-form"
              className="w-full"
              disabled={isSubmitting}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
        {isRedirecting && (
          <p className="text-muted-foreground text-sm mt-4 text-center">
            Redirecting you to login...
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
