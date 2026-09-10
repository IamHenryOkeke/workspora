import ResetPasswordForm from '@/components/auth/reset-password-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password | Workspora',
  description: 'Reset your password',
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
      <ResetPasswordForm token={token} />
    </main>
  );
}
