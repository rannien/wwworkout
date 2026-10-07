import Link from 'next/link';

export type BadgeSize = 'sm' | 'md';

export interface FilterBadgeProps {
  href: string;
  label: string;
  colorClasses: string;
  size?: BadgeSize;
  count?: number;
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'min-h-6 gap-1.5 px-2.5 py-1 text-xs',
  md: 'min-h-10 gap-2 px-4 py-2 text-sm',
};

export default function FilterBadge({ href, label, colorClasses, size = 'sm', count }: FilterBadgeProps) {
  return (
    <Link
      href={href}
      className={`${colorClasses} ${SIZE_CLASSES[size]} relative z-10 inline-flex items-center rounded-full font-medium capitalize ring-1 ring-inset transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-safe:hover:-translate-y-px`}
    >
      <span className="sr-only">Show exercises for </span>
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-white/60 px-1.5 text-xs font-semibold tabular-nums dark:bg-black/30">
          {count}
          <span className="sr-only"> exercises</span>
        </span>
      )}
    </Link>
  );
}
