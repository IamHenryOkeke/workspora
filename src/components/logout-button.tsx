'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Logout05Icon } from '@hugeicons/core-free-icons';
import { useLogout } from '@/hooks/use-logout';
import { ConfirmModal } from './dashboard/modal';

export default function LogoutButton() {
  const { open, setOpen, isPending, logout } = useLogout();

  return (
    <>
      <button
        type="button"
        aria-label="Log out"
        onClick={() => setOpen(true)}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 sm:size-auto sm:gap-2 sm:px-3.5 sm:py-2"
      >
        <HugeiconsIcon icon={Logout05Icon} size={16} />
        <span className="hidden sm:inline">Log out</span>
      </button>

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
