export interface MuscleColor {
  badge: string;
  fill: string;
}

// Full class strings so Tailwind never purges them.
export const MUSCLE_COLORS: Record<string, MuscleColor> = {
  abs:          { badge: 'bg-yellow-400/20  text-yellow-900  ring-yellow-500/40  dark:text-yellow-100',  fill: 'fill-yellow-400' },
  biceps:       { badge: 'bg-sky-400/20     text-sky-900     ring-sky-500/40     dark:text-sky-100',     fill: 'fill-sky-400' },
  calves:       { badge: 'bg-lime-400/20    text-lime-900    ring-lime-500/40    dark:text-lime-100',    fill: 'fill-lime-400' },
  chest:        { badge: 'bg-rose-400/20    text-rose-900    ring-rose-500/40    dark:text-rose-100',    fill: 'fill-rose-400' },
  glutes:       { badge: 'bg-orange-400/20  text-orange-900  ring-orange-500/40  dark:text-orange-100',  fill: 'fill-orange-400' },
  hamstrings:   { badge: 'bg-amber-400/20   text-amber-900   ring-amber-500/40   dark:text-amber-100',   fill: 'fill-amber-400' },
  lats:         { badge: 'bg-violet-400/20  text-violet-900  ring-violet-500/40  dark:text-violet-100',  fill: 'fill-violet-400' },
  'lower back': { badge: 'bg-red-400/20     text-red-900     ring-red-500/40     dark:text-red-100',     fill: 'fill-red-400' },
  quadriceps:   { badge: 'bg-teal-400/20    text-teal-900    ring-teal-500/40    dark:text-teal-100',    fill: 'fill-teal-400' },
  'rear delts': { badge: 'bg-pink-400/20    text-pink-900    ring-pink-500/40    dark:text-pink-100',    fill: 'fill-pink-400' },
  shoulders:    { badge: 'bg-indigo-400/20  text-indigo-900  ring-indigo-500/40  dark:text-indigo-100',  fill: 'fill-indigo-400' },
  traps:        { badge: 'bg-cyan-400/20    text-cyan-900    ring-cyan-500/40    dark:text-cyan-100',    fill: 'fill-cyan-400' },
  triceps:      { badge: 'bg-purple-400/20  text-purple-900  ring-purple-500/40  dark:text-purple-100',  fill: 'fill-purple-400' },
  'upper back': { badge: 'bg-emerald-400/20 text-emerald-900 ring-emerald-500/40 dark:text-emerald-100', fill: 'fill-emerald-400' },
};

export const FALLBACK_MUSCLE_COLOR: MuscleColor = {
  badge: 'bg-zinc-400/20 text-zinc-900 ring-zinc-500/40 dark:text-zinc-100',
  fill: 'fill-zinc-400',
};

export function muscleColor(muscle: string): MuscleColor {
  return MUSCLE_COLORS[muscle.toLowerCase()] ?? FALLBACK_MUSCLE_COLOR;
}
