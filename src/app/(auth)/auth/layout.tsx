'use client';

import React from 'react';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

function RedirectGate() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

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
            <div className="flex items-center gap-2.5 select-none">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white shadow-lg shadow-accent/30">
                W
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white">
                Work<span className="text-accent">spora</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </main>
  );
}
