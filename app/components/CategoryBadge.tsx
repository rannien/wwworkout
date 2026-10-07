import FilterBadge, { type BadgeSize } from '@/app/components/FilterBadge';
import { exerciseListHref } from '@/lib/exerciseFilters';

const CATEGORY_COLOR_CLASSES = 'bg-white/50 text-zinc-900 ring-zinc-900/15 dark:bg-white/10 dark:text-zinc-50 dark:ring-white/20';

interface CategoryBadgeProps {
  category: string;
  size?: BadgeSize;
  count?: number;
}

export default function CategoryBadge({ category, size, count }: CategoryBadgeProps) {
  return (
    <FilterBadge
      href={exerciseListHref({ category })}
      label={category}
      colorClasses={CATEGORY_COLOR_CLASSES}
      size={size}
      count={count}
    />
  );
}
