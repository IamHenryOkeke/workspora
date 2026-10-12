import InvitationsHome from '@/components/dashboard/invitations';

export const metadata = {
  title: 'Invitations',
  description: 'Manage your invitations',
};

export default function page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <InvitationsHome />
    </main>
  );
}
