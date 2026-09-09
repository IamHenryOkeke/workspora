'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTogglePasswordVisibity } from '@/hooks/use-toggle-password-visibility';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthService } from '@/services/auth';
import { ApiResponse } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';
import LoginWithGoogle from './login-with-google';
import CardWrapper from './card-wrapper';

const logInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 8 characters'),
});

type LoginPayload = z.infer<typeof logInSchema>;

const loginUser = async (payload: LoginPayload): Promise<ApiResponse> => {
  const { data } = await AuthService.login(payload);
  return data;
};

const resendVerificationEmail = async (email: string): Promise<ApiResponse> => {
  const { data } = await AuthService.resendVerification({ email });
  return data;
};

export default function LoginForm() {
  const { setAuth } = useAuthStore();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { showPassword, togglePasswordVisibity } = useTogglePasswordVisibity();

  const { handleSubmit, control, formState } = useForm<LoginPayload>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      toast.success('Login successful');
      if (res.accessToken && res.user) {
        setAuth({
          user: res.user,
          accessToken: res.accessToken,
        });
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errMessage = error.response?.data?.message;
      if (errMessage?.includes('verify your account')) {
        setUnverifiedEmail(loginMutation.variables?.email ?? null);
      } else {
        toast.error(errMessage || 'An error occurred');
      }
    },
  });

  const onSubmit = (data: LoginPayload) => {
    setUnverifiedEmail(null);
    loginMutation.mutate(data);
  };

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      toast.success(data.message || 'Verification email sent');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errMessage = error.response?.data?.error;
      toast.error(
        errMessage ||
          'An error occurred while resending the verification email',
      );
    },
  });

  const handleResendVerification = () => {
    if (unverifiedEmail) {
      resendMutation.mutate(unverifiedEmail);
    }
  };

  const isSubmitting = loginMutation.isPending || formState.isSubmitting;

  return (
    <CardWrapper
      title="Welcome back"
      description="Sign in to your account to continue"
      footerChildren={
        <p className="text-sm text-muted-foreground">
          No account?{' '}
          <Link href="/auth/sign-up" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <div>
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={fieldState.invalid}
                        className="pr-10"
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

              {unverifiedEmail && (
                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800 flex flex-col gap-2">
                  <p>
                    Your email <strong>{unverifiedEmail}</strong> is not
                    verified yet. Check your inbox or resend the link.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={resendMutation.isPending}
                    onClick={handleResendVerification}
                  >
                    {resendMutation.isPending
                      ? 'Sending...'
                      : 'Resend verification email'}
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                form="login-form"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Logging in..</span>
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-gray-600/30" />
          <span className="text-sm text-gray-400">or</span>
          <span className="h-px flex-1 bg-gray-600/30" />
        </div>
        <LoginWithGoogle />
      </div>
    </CardWrapper>
  );
}
