'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthService } from '@/services/auth';
import { InvitationTokenService } from '@/services/invitation-token';
import { ApiResponse, InvitationByToken } from '@/lib/types';
import LoginWithGoogle from './login-with-google';
import CardWrapper from './card-wrapper';
import { PasswordInput } from '../ui/password-input';
import { signUpSchema } from '@/lib/schemas';
import { extractDetailsMessage } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

type SignUpPayload = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
  inviteToken?: string;
  next?: string;
};

const signUpUser = async (payload: SignUpPayload): Promise<ApiResponse> => {
  const { fullName, email, password, inviteToken } = payload;
  const { data } = await AuthService.register({
    fullName,
    email: inviteToken ? undefined : email,
    password,
    inviteToken,
  });
  return data;
};

const fetchInvitation = async (
  token: string,
): Promise<ApiResponse<InvitationByToken>> => {
  const { data } =
    await InvitationTokenService.getInvitationByInviteToken(token);
  return data;
};

export default function SignUpForm({ inviteToken, next }: SignUpFormProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const inviteQuery = useQuery({
    queryKey: ['invitation', inviteToken, 'signup'],
    queryFn: () => fetchInvitation(inviteToken as string),
    enabled: !!inviteToken,
    retry: false,
  });

  const invitation = inviteQuery.data?.data;

  const { handleSubmit, control, formState, reset } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      inviteToken,
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      toast.success(data.message || 'Signup successful');
      if (data.accessToken && data.user) {
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        });
      }
      if (inviteToken) {
        const target =
          next && next.startsWith('/') && !next.startsWith('//')
            ? next
            : `/invite/${inviteToken}`;
        router.push(target);
        router.refresh();
        return;
      }
      reset();
    },
    onError: (
      error: AxiosError<{
        message: string;
        details?: Record<string, string[]>;
      }>,
    ) => {
      const details = error.response?.data?.details;
      const detailMessages = extractDetailsMessage(details);

      toast.error(
        error.response?.data?.message || 'An error occurred during sign up',
        {
          description: detailMessages.length ? detailMessages.join('. ') : '',
        },
      );
    },
  });

  const onSubmit = (data: SignUpPayload) => {
    signUpMutation.mutate(data);
  };

  const isSubmitting = signUpMutation.isPending || formState.isSubmitting;

  if (inviteToken && inviteQuery.isPending) {
    return (
      <CardWrapper
        title="Create your Workspora account"
        description="Loading your invitation..."
      >
        <div className="h-40 animate-pulse rounded-lg bg-white/5" />
      </CardWrapper>
    );
  }

  if (inviteToken && (inviteQuery.error || !invitation)) {
    return (
      <CardWrapper
        title="Invitation not found"
        description="This invite link is invalid or could not be loaded."
        footerChildren={
          <Link
            href="/auth/sign-up"
            className="text-sm text-accent hover:underline"
          >
            Sign up without an invitation
          </Link>
        }
      >
        <></>
      </CardWrapper>
    );
  }

  if (inviteToken && invitation && invitation.status !== 'PENDING') {
    return (
      <CardWrapper
        title="Invitation unavailable"
        description="This invitation is no longer active. Ask an admin to send a new one."
        footerChildren={
          <Link
            href="/auth/login"
            className="text-sm text-accent hover:underline"
          >
            Log in
          </Link>
        }
      >
        <></>
      </CardWrapper>
    );
  }

  const loginHref = inviteToken
    ? `/auth/login?next=${encodeURIComponent(next ?? `/invite/${inviteToken}`)}`
    : '/auth/login';

  return (
    <CardWrapper
      title="Create your Workspora account"
      description={
        invitation
          ? `You're joining ${invitation.organization.name}`
          : 'Enter your details below to get started'
      }
      footerChildren={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={loginHref} className="text-accent hover:underline">
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

              {invitation ? (
                <Field>
                  <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                  <Input
                    id="invite-email"
                    value={invitation.maskedEmail}
                    readOnly
                    disabled
                  />
                </Field>
              ) : (
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
              )}

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
        {!inviteToken && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-px flex-1 bg-gray-600/30" />
              <span className="text-sm text-gray-400">or</span>
              <span className="h-px flex-1 bg-gray-600/30" />
            </div>
            <LoginWithGoogle />
          </>
        )}
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
