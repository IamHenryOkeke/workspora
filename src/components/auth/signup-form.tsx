'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { useTogglePasswordVisibity } from '@/hooks/use-toggle-password-visibility';
import { Eye, EyeOff } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthService } from '@/services/auth';
import { ApiResponse } from '@/lib/types';
import LoginWithGoogle from './login-with-google';
import CardWrapper from './card-wrapper';

const signUpSchema = z
  .object({
    fullName: z
      .string({ error: 'Name is required' })
      .min(3, { error: 'Name must be at least 3 characters long' })
      .trim(),
    email: z.email({ error: 'Email must be valid' }).trim().toLowerCase(),
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

type SignUpPayload = z.infer<typeof signUpSchema>;

const signUpUser = async (payload: SignUpPayload): Promise<ApiResponse> => {
  const { fullName, email, password } = payload;
  const { data } = await AuthService.register({ fullName, email, password });
  return data;
};

export default function SignUpForm() {
  const { showPassword, togglePasswordVisibity } = useTogglePasswordVisibity();

  const { handleSubmit, control, formState, reset } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      toast.success(data.message || 'Signup successful');
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'An error occurred during sign up',
      );
    },
  });

  const onSubmit = (data: SignUpPayload) => {
    signUpMutation.mutate(data);
  };

  const isSubmitting = signUpMutation.isPending || formState.isSubmitting;

  return (
    <CardWrapper
      title="Create your Workspora account"
      description="Enter your details below to get started"
      footerChildren={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <div>
          <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <Controller
                name="fullName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane Smith"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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
                form="signup-form"
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
                    <span>Creating Account. Please wait..</span>
                  </>
                ) : (
                  'Create Account'
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
        <p className="text-muted-foreground text-center text-xs">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline-offset-4 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </CardWrapper>
  );
}
