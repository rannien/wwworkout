import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="glass inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full px-4 py-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-zinc-500 dark:text-zinc-400">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium text-sky-700 transition hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-sky-300 dark:hover:text-sky-100"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-zinc-700 dark:text-zinc-300">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
