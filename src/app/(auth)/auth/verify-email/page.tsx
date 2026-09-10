import VerifyEmail from '@/components/auth/verify-email';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Verify Email | Workspora',
  description: 'Verify your email address',
};

export default async function page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = (await searchParams).token;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <VerifyEmail token={token} />
    </main>
  );
}
