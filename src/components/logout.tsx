'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { ConfirmModal } from './dashboard/modal';
import { SidebarMenuItem } from './ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout05Icon } from '@hugeicons/core-free-icons';

export default function Logout() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      clearAuth();
      setOpen(false);
      router.push('/auth/login');
    },
    onError: () => {
      toast.error('Failed to log out. Please try again.');
    },
  });

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
        isLoading={logoutMutation.isPending}
        onConfirm={() => logoutMutation.mutate()}
      />
    </>
  );
}
