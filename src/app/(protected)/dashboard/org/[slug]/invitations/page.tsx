import InvitationHome from '@/components/dashboard/org/invitations';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-w-5xl p-4">
      <InvitationHome slug={slug} />
    </main>
  );
}
