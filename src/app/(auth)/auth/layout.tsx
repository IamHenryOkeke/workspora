'use client';

import React from 'react';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import Logo from '@/components/logo';

function RedirectGate() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || searchParams.get('next');

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push(redirect || '/dashboard/org');
    }
  }, [isHydrated, isAuthenticated, router, redirect]);

  return null;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <main>
      <Suspense fallback={null}>
        <RedirectGate />
      </Suspense>

      {!isHydrated || isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">
            <Logo />
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </main>
  );
}
