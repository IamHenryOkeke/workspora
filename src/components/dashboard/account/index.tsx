'use client';

import { useQuery } from '@tanstack/react-query';
import { usePageTitle } from '@/hooks/use-page-title';
import { UserService } from '@/services/user';
import { User, ApiResponse } from '@/lib/types';
import ProfileForm from './profile-form';
import ChangePasswordForm from './change-password-form';
import LogoutButton from '@/components/logout-button';
import BackButton from '../org/back-button';

export const ACCOUNT_QUERY_KEY = ['me'] as const;

const fetchAccount = async (): Promise<ApiResponse<{ user: User }>> => {
  const { data } = await UserService.getMe();
  return data;
};

export default function AccountHome() {
  usePageTitle('Account settings');

  const { data, isPending, error } = useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: fetchAccount,
  });

  const user = data?.data?.user;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <BackButton title="Go back" />
        <LogoutButton />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          These details apply to you across all organizations.
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col gap-8">
          <div className="h-80 max-w-2xl animate-pulse rounded-md bg-white/5" />
          <div className="h-72 max-w-2xl animate-pulse rounded-md bg-white/5" />
        </div>
      )}

      {!isPending && (error || !user) && (
        <div className="max-w-2xl rounded-md border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm font-medium text-red-400">
            Couldn&apos;t load your account
          </p>
          {error && (
            <p className="mt-1 text-xs text-red-400/70">{error.message}</p>
          )}
        </div>
      )}

      {user && (
        <div className="flex flex-col gap-8">
          <ProfileForm user={user} />
          <ChangePasswordForm hasPassword={user.hasPassword} />
        </div>
      )}
    </div>
  );
}
