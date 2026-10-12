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
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
      >
        <HugeiconsIcon icon={Logout05Icon} size={16} />
        Log out
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
