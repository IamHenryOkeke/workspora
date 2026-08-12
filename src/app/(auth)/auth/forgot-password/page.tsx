import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Workspora',
  description: 'Reset your password',
};

export default function ForgotPassword() {
  return (
    <main className="h-screen flex items-center justify-center">
      <ForgotPasswordForm />
    </main>
  );
}
