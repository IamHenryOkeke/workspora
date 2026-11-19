import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-white/8 bg-white/3 p-8 text-center">
        <p className="text-5xl font-bold text-white sm:text-6xl">404</p>
        <h1 className="mt-4 text-lg font-medium text-white">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
