import SettingsHome from '@/components/dashboard/org/settings';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-w-5xl p-4">
      <SettingsHome slug={slug} />
    </main>
  );
}
