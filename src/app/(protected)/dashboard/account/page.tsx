import AccountHome from '@/components/dashboard/account';

export const metadata = {
  title: 'Account | Workspora',
  description: 'Manage your account settings and preferences.',
};

export default function page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <AccountHome />
    </main>
  );
}
