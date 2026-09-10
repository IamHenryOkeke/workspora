import OrganizationHome from '@/components/dashboard/org/home';

export default async function OrganzationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-w-5xl p-4">
      <OrganizationHome slug={slug} />
    </main>
  );
}
