import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SiteHeader from '@/app/components/SiteHeader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WWWorkout',
  description: 'Browse and filter exercises by muscle group, category, and mechanics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-zinc-900 focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
