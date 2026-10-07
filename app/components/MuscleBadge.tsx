import FilterBadge, { type BadgeSize } from '@/app/components/FilterBadge';
import { muscleColor } from '@/app/components/muscleColors';
import { exerciseListHref } from '@/lib/exerciseFilters';

interface MuscleBadgeProps {
  muscle: string;
  size?: BadgeSize;
  count?: number;
}

export default function MuscleBadge({ muscle, size, count }: MuscleBadgeProps) {
  return (
    <FilterBadge
      href={exerciseListHref({ muscleGroup: muscle })}
      label={muscle}
      colorClasses={muscleColor(muscle).badge}
      size={size}
      count={count}
    />
  );
}
