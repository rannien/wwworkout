'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/exercises', label: 'Exercises' },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-8">
      <nav aria-label="Main" className="glass flex items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-2">
        <Link
          href="/"
          aria-label="WWWorkout home"
          className="flex items-center gap-2 rounded-full px-2 py-1 font-semibold tracking-tight text-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-50"
        >
          <svg viewBox="0 0 64 64" aria-hidden="true" className="size-8">
            <rect width="64" height="64" rx="16" className="fill-zinc-900 dark:fill-zinc-800" />
            <polyline
              points="12,20 22,45 32,26 42,45 52,20"
              className="fill-none stroke-orange-400"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">WWWorkout</span>
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-sky-500 ${
                    active
                      ? 'glass-strong text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-700 hover:bg-white/50 dark:text-zinc-300 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
