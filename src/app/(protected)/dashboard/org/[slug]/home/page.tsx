import OrganizationHome from '@/components/dashboard/org/organiation-home';

export default async function OrganzationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <OrganizationHome slug={slug} />
    </main>
  );
}
