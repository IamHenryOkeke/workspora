import React from 'react';

import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
