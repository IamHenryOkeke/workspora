import SignUpForm from '@/components/auth/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Workspora',
  description: 'Create a new account',
};

type PageProps = {
  searchParams: Promise<{ invite?: string; next?: string }>;
};

export default async function page({ searchParams }: PageProps) {
  const { invite, next } = await searchParams;

  return (
    <main className="h-screen flex items-center justify-center">
      <SignUpForm inviteToken={invite} next={next} />
    </main>
  );
}
