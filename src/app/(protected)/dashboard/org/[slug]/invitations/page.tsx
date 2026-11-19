import InvitationHome from '@/components/dashboard/org/invitations';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="w-full max-w-5xl p-4">
      <InvitationHome slug={slug} />
    </main>
  );
}
