import Organizations from '@/components/dashboard/organizations';

export default async function page({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = (await searchParams).page;
  const query = (await searchParams).query;

  return (
    <main>
      <Organizations page={Number(page) || 1} query={query || ''} />
    </main>
  );
}
