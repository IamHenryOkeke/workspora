import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/providers/query-provider';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Workspora',
  description: 'Collaborate on your projects with ease using Workspora.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable + ' scroll-smooth'}>
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
        <Toaster duration={2000} position="top-right" />
      </body>
    </html>
  );
}
