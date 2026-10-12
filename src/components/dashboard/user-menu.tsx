'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown01Icon,
  Logout05Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-logout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import UserAvatar from '../user-avatar';
import { ConfirmModal } from './modal';
import { ROLE_LABELS } from './role-badge';

export default function UserMenu({ role }: { role?: string }) {
  const { user } = useAuthStore();
  const { open, setOpen, isPending, logout } = useLogout();

  const roleLabel = ROLE_LABELS[(role as keyof typeof ROLE_LABELS) || 'MEMBER'];
  const displayName = user?.fullName || user?.email?.split('@')[0];

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left hover:bg-gray-700/50"
          >
            <div className="flex min-w-0 items-center gap-2">
              <UserAvatar
                name={user?.fullName}
                email={user?.email}
                image={user?.avatar}
                className="h-7 w-7"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-gray-300">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500">{roleLabel}</span>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="shrink-0 rotate-180 text-gray-500"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="w-56 space-y-1 border border-white/10"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/account"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white"
            >
              <HugeiconsIcon icon={UserIcon} size={16} />
              <span>Account settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="border-white/10" />

          <DropdownMenuItem
            onSelect={() => setOpen(true)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-red-400 focus:text-red-400"
          >
            <HugeiconsIcon icon={Logout05Icon} size={16} />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Log out?"
        description="You'll need to sign in again to access your account."
        confirmLabel="Log out"
        variant="destructive"
        isLoading={isPending}
        onConfirm={logout}
      />
    </>
  );
}
