import CreateOrganisationForm from '@/components/dashboard/create-organization-form';

export default function page() {
  return (
    <main>
      <div className="h-screen flex flex-col items-center justify-center">
        <CreateOrganisationForm />
      </div>
    </main>
  );
}
