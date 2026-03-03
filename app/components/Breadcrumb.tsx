import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index}>
            {index > 0 && (
              <span className="mx-2 text-zinc-400">/</span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-600 dark:text-zinc-400">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}