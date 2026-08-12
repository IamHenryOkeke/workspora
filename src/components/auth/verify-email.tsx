'use client';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth';
import { ApiResponse } from '@/lib/types';
import axios from 'axios';

type VerifyStatus = 'loading' | 'success' | 'error';

const verifyEmail = async (token: string): Promise<ApiResponse> => {
  const { data } = await AuthService.verifyEmail(token);
  return data;
};

const REDIRECT_DELAY_MS = 3000;

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'loading' && (
          <>
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <p className="text-muted-foreground text-sm">
              Verifying your email...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <svg
              className="h-12 w-12 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-base font-medium">{message}</p>
            <p className="text-muted-foreground text-sm">
              Redirecting you to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <svg
              className="h-12 w-12 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-base font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
