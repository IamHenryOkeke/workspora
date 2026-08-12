'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google sign-in failed');
      router.replace('/auth/login');
      return;
    }

    if (!token || !userParam) {
      router.replace('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userParam);
      setAuth({ token, user });
      toast.success('Logged in successfully');
      router.replace('/dashboard/org');
    } catch {
      toast.error('Something went wrong signing you in');
      router.replace('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing you in...</p>
    </div>
  );
}
