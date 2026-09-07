'use client';

import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';
import { Modal } from './dashboard/modal';
import { Logout05Icon } from '@hugeicons/core-free-icons';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
export function Logout() {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  return (
    <Modal
      title="Logout"
      trigger={
        <SidebarMenuItem>
          <div className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-gray-700/50">
            <HugeiconsIcon icon={Logout05Icon} />
            <span>Logout</span>
          </div>
        </SidebarMenuItem>
      }
      description="Are you sure you want to logout? You will be redirected to the login page."
      confirmText="Yes, Logout"
      onConfirm={handleLogout}
    />
  );
}
