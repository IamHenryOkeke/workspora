import Organizations from '@/components/dashboard/organizations';

export default async function page({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = (await searchParams).page;
  const query = (await searchParams).query;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Organizations page={Number(page) || 1} query={query || ''} />
    </main>
  );
}
