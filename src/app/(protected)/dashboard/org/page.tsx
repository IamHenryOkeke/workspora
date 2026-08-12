import Organisations from '@/components/dashboard/organization';

export default function page() {
  return (
    <main>
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">
          This is the protected home page.
        </p>
        <div>
          <Organisations />
        </div>
      </div>
    </main>
  );
}
