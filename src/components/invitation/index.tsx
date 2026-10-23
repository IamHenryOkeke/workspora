'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/logout-button';
import OrganizationLogo from '@/components/dashboard/organization-logo';
import { ConfirmModal } from '@/components/dashboard/modal';
import { ROLE_LABELS } from '@/components/dashboard/role-badge';
import {
  ApiResponse,
  InvitationByToken,
  InvitationStatusType,
} from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { InvitationTokenService } from '@/services/invitation-token';
import { useAuthStore } from '@/stores/auth-store';
import { useOrganizationStore } from '@/stores/org-store';
import { toast } from 'sonner';

type AcceptResponse = { organization: { slug: string } };

const fetchInvitationByInviteToken = async (
  token: string,
): Promise<ApiResponse<InvitationByToken>> => {
  const { data } =
    await InvitationTokenService.getInvitationByInviteToken(token);
  return data;
};

const UNAVAILABLE_COPY: Record<
  Exclude<InvitationStatusType, 'PENDING'>,
  { title: string; body: string }
> = {
  ACCEPTED: {
    title: 'Invitation already accepted',
    body: 'This invitation has already been used.',
  },
  DECLINED: {
    title: 'Invitation declined',
    body: 'This invitation was declined. Ask an admin to send a new one if that was a mistake.',
  },
  EXPIRED: {
    title: 'This invitation has expired',
    body: 'Ask an admin of the organization to send you a new invitation.',
  },
  REVOKED: {
    title: 'This invitation was revoked',
    body: 'The organization cancelled this invitation. Contact an admin if you think that was a mistake.',
  },
};

const primaryLinkClass =
  'flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent/80';
const secondaryLinkClass =
  'flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/3 p-8 text-center">
        {children}
      </div>
    </main>
  );
}

function Message({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-gray-400">{body}</p>
      {children && <div className="mt-6 flex flex-col gap-2">{children}</div>}
    </>
  );
}

export default function InvitationPreview({ token }: { token: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [declineOpen, setDeclineOpen] = useState(false);

  const query = searchParams.toString();
  const fullPath = query ? `${pathname}?${query}` : pathname;

  const { isPending, error, data } = useQuery({
    queryKey: ['invitation', token, user?.id ?? 'anonymous'],
    queryFn: () => fetchInvitationByInviteToken(token),
    enabled: !!token,
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const { data } =
        await InvitationTokenService.acceptInvitationByInviteToken(token);
      return data as ApiResponse<AcceptResponse>;
    },
    onSuccess: async (res) => {
      toast.success(res.message || 'Invitation accepted');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['organizations'] }),
        queryClient.invalidateQueries({ queryKey: ['my-invitations'] }),
      ]);
      // The sidebar reads its own copy of the list, so refresh it before navigating
      await useOrganizationStore.getState().fetchOrganizations();

      const slug = res.data?.organization?.slug;
      router.replace(slug ? `/dashboard/org/${slug}/home` : '/dashboard/org');
    },
    onError: async (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to accept invitation',
      );
      await queryClient.invalidateQueries({ queryKey: ['invitation', token] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      const { data } =
        await InvitationTokenService.declineInvitationByInviteToken(token);
      return data as ApiResponse;
    },
    onSuccess: async (res) => {
      toast.success(res.message || 'Invitation declined');
      setDeclineOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      router.replace('/dashboard/org');
    },
    onError: async (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Failed to decline invitation',
      );
      await queryClient.invalidateQueries({ queryKey: ['invitation', token] });
    },
  });

  if (isPending) {
    return (
      <Shell>
        <div className="mx-auto h-14 w-14 animate-pulse rounded-lg bg-white/5" />
        <div className="mx-auto mt-5 h-6 w-48 animate-pulse rounded bg-white/5" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-white/5" />
        <div className="mt-8 h-10 animate-pulse rounded-lg bg-white/5" />
      </Shell>
    );
  }

  if (error || !data?.data) {
    const notFound = (error as AxiosError | null)?.response?.status === 404;
    return (
      <Shell>
        <Message
          title={
            notFound ? 'Invitation not found' : "Couldn't load this invitation"
          }
          body={
            notFound
              ? 'This link is invalid or no longer exists. Check that you opened the full link from your email.'
              : 'Something went wrong. Please try again in a moment.'
          }
        >
          {!notFound && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['invitation', token],
                })
              }
            >
              Try again
            </Button>
          )}
        </Message>
      </Shell>
    );
  }

  const invitation = data.data;

  if (invitation.status !== 'PENDING') {
    const copy = UNAVAILABLE_COPY[invitation.status];
    return (
      <Shell>
        <Message title={copy.title} body={copy.body}>
          <Link
            href={user ? '/dashboard/org' : '/auth/login'}
            className={secondaryLinkClass}
          >
            {user ? 'Go to your organizations' : 'Log in'}
          </Link>
        </Message>
      </Shell>
    );
  }

  const orgName = invitation.organization.name;
  const roleLabel =
    ROLE_LABELS[invitation.role as keyof typeof ROLE_LABELS] ?? invitation.role;
  const inviter = invitation.invitedBy?.fullName ?? 'An admin';

  const wrongAccount = Boolean(user) && invitation.isInvitee === false;

  const next = encodeURIComponent(fullPath);

  return (
    <Shell>
      <div className="flex justify-center">
        <OrganizationLogo
          name={orgName}
          logo={invitation.organization.logo}
          size={56}
        />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-white">Join {orgName}</h1>
      <p className="mt-2 text-sm text-gray-400">
        {inviter} invited you to join as{' '}
        <span className="text-white">{roleLabel}</span>.
      </p>
      <p className="mt-1 text-xs text-gray-600">
        Sent to {invitation.maskedEmail} · Expires{' '}
        {formatDate(invitation.expiresAt)}
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {!user && (
          <>
            <p className="mb-2 text-xs text-gray-500">
              Log in or create an account with {invitation.maskedEmail} to
              accept.
            </p>
            <Link
              href={`/auth/login?next=${next}`}
              className={primaryLinkClass}
            >
              Log in to accept
            </Link>
            <Link
              href={`/auth/sign-up?invite=${encodeURIComponent(token)}&next=${next}`}
              className={secondaryLinkClass}
            >
              Create an account
            </Link>
          </>
        )}

        {user && wrongAccount && (
          <>
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300/90">
              You&apos;re signed in as {user.email}, but this invitation was
              sent to {invitation.maskedEmail}. Log out and sign in with that
              address to accept it.
            </p>
            <div className="mt-2 flex justify-center">
              <LogoutButton />
            </div>
          </>
        )}

        {user && !wrongAccount && (
          <>
            <Button
              type="button"
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending || declineMutation.isPending}
            >
              {acceptMutation.isPending ? 'Joining...' : 'Accept invitation'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeclineOpen(true)}
              disabled={acceptMutation.isPending || declineMutation.isPending}
            >
              Decline
            </Button>
          </>
        )}
      </div>

      <ConfirmModal
        open={declineOpen}
        onOpenChange={setDeclineOpen}
        title="Decline Invitation?"
        description={`You won't join ${orgName}. They'll need to send a new invitation if you change your mind.`}
        confirmLabel="Decline Invitation"
        variant="destructive"
        isLoading={declineMutation.isPending}
        onConfirm={() => declineMutation.mutate()}
      />
    </Shell>
  );
}
