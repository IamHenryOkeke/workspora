import InvitationHome from '@/components/invitation';
import { redirect } from 'next/navigation';

export default async function page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = (await searchParams).token;

  if (!token) {
    redirect('/');
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <InvitationHome token={token} />
    </main>
  );
}
