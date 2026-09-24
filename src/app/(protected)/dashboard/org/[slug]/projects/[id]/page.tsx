import BackButton from '@/components/dashboard/org/back-button';
import ProjectDetailPage from '@/components/dashboard/org/projects/[id]';

export default async function page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return (
    <main className="min-w-5xl p-4">
      <BackButton title="Back to projects" />
      <ProjectDetailPage projectId={id} slug={slug} />
    </main>
  );
}
