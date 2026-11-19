import OrganizationHome from '@/components/dashboard/org/home';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="w-full max-w-5xl py-4 px-4 lg:px-10">
      <OrganizationHome slug={slug} />
    </main>
  );
}
