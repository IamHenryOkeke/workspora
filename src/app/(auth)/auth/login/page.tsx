import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | Workspora',
  description: 'Log in to your account',
};

export default function page() {
  return (
    <main className="h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
