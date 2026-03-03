// Hardcoded per-muscle color map — full class strings so Tailwind never purges them.
const MUSCLE_COLOR_MAP: Record<string, string> = {
  abs:          'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  biceps:       'bg-sky-100    dark:bg-sky-900    text-sky-800    dark:text-sky-100',
  calves:       'bg-lime-100   dark:bg-lime-900   text-lime-800   dark:text-lime-100',
  chest:        'bg-rose-100   dark:bg-rose-900   text-rose-800   dark:text-rose-100',
  glutes:       'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100',
  hamstrings:   'bg-amber-100  dark:bg-amber-900  text-amber-800  dark:text-amber-100',
  lats:         'bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-100',
  'lower back':  'bg-red-100    dark:bg-red-900    text-red-800    dark:text-red-100',
  quadriceps:   'bg-teal-100   dark:bg-teal-900   text-teal-800   dark:text-teal-100',
  'rear delts':  'bg-pink-100   dark:bg-pink-900   text-pink-800   dark:text-pink-100',
  shoulders:    'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100',
  traps:        'bg-cyan-100   dark:bg-cyan-900   text-cyan-800   dark:text-cyan-100',
  triceps:      'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
  'upper back':  'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100',
};

const FALLBACK = 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300';

interface MuscleBadgeProps {
  muscle: string;
  /** 'sm' is for cards/lists, 'md' is for the detail hero section */
  size?: 'sm' | 'md';
}

export default function MuscleBadge({ muscle, size = 'sm' }: MuscleBadgeProps) {
  const colorClasses = MUSCLE_COLOR_MAP[muscle.toLowerCase()] ?? FALLBACK;
  const sizeClasses = size === 'md'
    ? 'px-4 py-2 text-sm font-medium rounded-lg'
    : 'px-2 py-0.5 text-xs rounded';

  return (
    <span className={`${colorClasses} ${sizeClasses} capitalize`}>
      {muscle}
    </span>
  );
}