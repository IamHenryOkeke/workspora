import SettingsHome from '@/components/dashboard/org/settings';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="w-full max-w-5xl p-4">
      <SettingsHome slug={slug} />
    </main>
  );
}
