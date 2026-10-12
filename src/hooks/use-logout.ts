import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useOrganizationStore } from '@/stores/org-store';

export function useLogout() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setOpen(false);
      useOrganizationStore.getState().clear();
      queryClient.clear();
      clearAuth();
    },
    onError: () => {
      toast.error('Failed to log out. Please try again.');
    },
  });

  return {
    open,
    setOpen,
    isPending: mutation.isPending,
    logout: () => mutation.mutate(),
  };
}
