'use client';

import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';
import { Modal } from './dashboard/modal';

export function Logout() {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  return (
    <Modal
      title="Logout"
      trigger={<button>Hello</button>}
      description="Are you sure you want to logout? You will be redirected to the login page."
      confirmText="Yes, Logout"
      onConfirm={handleLogout}
    />
  );
}
