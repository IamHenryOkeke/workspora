import SignUpForm from '@/components/auth/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Workspora',
  description: 'Create a new account',
};

export default function SignUp() {
  return (
    <main className="h-screen flex items-center justify-center">
      <SignUpForm />
    </main>
  );
}
