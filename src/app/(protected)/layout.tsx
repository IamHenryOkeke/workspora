'use client';

import Logo from '@/components/logo';
import { useAuthStore } from '@/stores/auth-store';
import { useOrganizationStore } from '@/stores/org-store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { fetchOrganizations } = useOrganizationStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    const handleFetchOrganizations = async () => {
      await fetchOrganizations();
    };

    if (isHydrated && isAuthenticated) {
      handleFetchOrganizations();
    }
  }, [isHydrated, isAuthenticated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Logo />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
