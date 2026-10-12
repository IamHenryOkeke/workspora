'use client';

import { ConfirmModal } from './dashboard/modal';
import { SidebarMenuItem } from './ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout05Icon } from '@hugeicons/core-free-icons';
import { useLogout } from '@/hooks/use-logout';

export default function Logout() {
  const { open, setOpen, isPending, logout } = useLogout();

  return (
    <>
      <SidebarMenuItem onClick={() => setOpen(true)}>
        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-gray-700/50">
          <HugeiconsIcon icon={Logout05Icon} />
          <span>Logout</span>
        </div>
      </SidebarMenuItem>

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
