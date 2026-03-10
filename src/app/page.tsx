import HomeNavbar from '@/components/home-navbar';

export default function Home() {
  return (
    <main>
      <HomeNavbar />
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-accent">Hello, World!</h1>
      </div>
    </main>
  );
}
