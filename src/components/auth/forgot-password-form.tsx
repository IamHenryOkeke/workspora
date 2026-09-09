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
import { ApiResponse } from '@/lib/types';
import { AuthService } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import CardWrapper from './card-wrapper';

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse> => {
  const { data } = await AuthService.forgotPassword(payload);
  return data;
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { handleSubmit, control, formState } = useForm<
    z.infer<typeof forgotPasswordSchema>
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      toast.success(res.message || 'Password reset link sent to your email');
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

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(data);
  };

  const isSubmitting =
    forgotPasswordMutation.isPending || isRedirecting || formState.isSubmitting;

  return (
    <CardWrapper
      title="Forgot Password to Workspora"
      description="Enter your email below to request a password reset link."
      footerChildren={
        <p className="text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-accent hover:underline">
            Go back
          </Link>
        </p>
      }
    >
      <div>
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="m@example.com"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="forgot-password-form"
              className="w-full"
              disabled={isSubmitting}
            >
              {forgotPasswordMutation.isPending ? (
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
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
