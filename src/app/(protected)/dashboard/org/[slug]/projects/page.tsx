import Projects from '@/components/dashboard/org/projects';
import { ProjectStatusFilter } from '@/lib/types';

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const status = (await searchParams).status as ProjectStatusFilter;
  return (
    <main className="min-w-5xl p-4">
      <Projects status={status || 'ALL'} slug={slug} />
    </main>
  );
}
