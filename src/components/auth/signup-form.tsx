'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthService } from '@/services/auth';
import { ApiResponse } from '@/lib/types';
import LoginWithGoogle from './login-with-google';
import CardWrapper from './card-wrapper';
import { PasswordInput } from '../ui/password-input';
import { signUpSchema } from '@/lib/schemas';

type SignUpPayload = z.infer<typeof signUpSchema>;

const signUpUser = async (payload: SignUpPayload): Promise<ApiResponse> => {
  const { fullName, email, password } = payload;
  const { data } = await AuthService.register({ fullName, email, password });
  return data;
};

export default function SignUpForm() {
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
    onError: (
      error: AxiosError<{
        message: string;
        details?: Record<string, string[]>;
      }>,
    ) => {
      const details = error.response?.data?.details;
      const detailMessages = details ? Object.values(details).flat() : [];

      toast.error(
        error.response?.data?.message || 'An error occurred during sign up',
        {
          description: detailMessages.length
            ? detailMessages.join('. ')
            : 'Please try again later.',
        },
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
                    <PasswordInput
                      {...field}
                      placeholder="Enter a password"
                      id="password"
                    />
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
                    <PasswordInput
                      {...field}
                      placeholder="Confirm your password"
                      id="confirmPassword"
                    />
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
