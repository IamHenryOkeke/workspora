'use client';

import { Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiResponse } from '@/lib/types';
import { AuthService } from '@/services/auth';
import Logo from '../logo';

type VerifyStatus = 'loading' | 'success' | 'error';

const REDIRECT_DELAY_MS = 3000;

const verifyEmail = async (token: string): Promise<ApiResponse> => {
  const { data } = await AuthService.verifyEmail(token);
  return data;
};

export default function VerifyEmail({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let redirectTimeout: ReturnType<typeof setTimeout>;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        toast.success(response.message);
        setMessage(
          response.message ?? 'Your email has been verified successfully.',
        );
        setStatus('success');

        redirectTimeout = setTimeout(() => {
          router.push('/auth/login');
        }, REDIRECT_DELAY_MS);
      } catch (error: unknown) {
        let errorMessage = 'An error occurred while verifying your email.';
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
        setMessage(errorMessage);
        setStatus('error');
      }
    };

    verify();

    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [token, router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-105 bg-linear-to-t from-accent/10 via-accent/3 to-transparent"
      />

      <div className="relative flex w-full max-w-md flex-col items-center gap-8">
        <Logo />

        <div
          role="status"
          aria-live="polite"
          className="flex w-full flex-col items-center gap-5 border border-white/8 bg-[#111111] px-8 py-12 text-center shadow-2xl shadow-black/60"
        >
          {status === 'loading' && (
            <>
              <svg
                className="h-10 w-10 animate-spin text-accent"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Verifying your email...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <span className="flex h-14 w-14 items-center justify-center border border-accent/40 bg-accent/10 text-accent">
                <HugeiconsIcon icon={Tick02Icon} size={26} />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  {message}
                </h1>
                <p className="text-sm text-gray-500">
                  Redirecting you to login...
                </p>
              </div>
              <Link
                href="/auth/login"
                className="mt-2 bg-accent px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Continue to login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <span className="flex h-14 w-14 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-400">
                <HugeiconsIcon icon={Cancel01Icon} size={26} />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Verification failed
                </h1>
                <p className="text-sm text-gray-500">{message}</p>
              </div>
              <Link
                href="/auth/login"
                className="mt-2 border border-white/10 bg-white/3 px-6 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/6 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
