import Link from 'next/link';
import { filterExercises } from '@/lib/exerciseDb';
import { exerciseListHref } from '@/lib/exerciseFilters';
import { muscleColor } from '@/app/components/muscleColors';

interface MuscleMatrixProps {
  muscleGroups: string[];
  movementPatterns: string[];
}

const HEAT_LEVELS = [
  { min: 10, label: '10+', classes: 'bg-orange-500 text-zinc-950' },
  { min: 6, label: '6–9', classes: 'bg-orange-400/60 text-zinc-900 dark:text-zinc-50' },
  { min: 3, label: '3–5', classes: 'bg-orange-400/35 text-zinc-900 dark:text-zinc-50' },
  { min: 1, label: '1–2', classes: 'bg-orange-400/15 text-zinc-900 dark:text-zinc-50' },
];

function heatClasses(count: number): string {
  return HEAT_LEVELS.find((level) => count >= level.min)?.classes ?? '';
}

const HEADER_LINK =
  'inline-flex min-h-6 items-center rounded-md capitalize hover:text-zinc-950 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sky-600 dark:hover:text-white';

export default function MuscleMatrix({ muscleGroups, movementPatterns }: MuscleMatrixProps) {
  return (
    <div className="glass rounded-4xl p-4 sm:p-6">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-xl border-separate border-spacing-1 text-sm">
          <caption className="sr-only">Number of exercises for each muscle group and movement pattern</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-2 pb-2 text-left font-mono text-xs font-medium tracking-widest text-zinc-600 uppercase dark:text-zinc-400"
              >
                Muscle
              </th>
              {movementPatterns.map((pattern) => (
                <th
                  key={pattern}
                  scope="col"
                  className="px-2 pb-2 text-center font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  <Link href={exerciseListHref({ movementPattern: pattern })} className={HEADER_LINK}>
                    {pattern}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {muscleGroups.map((muscleGroup) => (
              <tr key={muscleGroup}>
                <th
                  scope="row"
                  className="pr-3 text-left font-medium whitespace-nowrap text-zinc-800 dark:text-zinc-200"
                >
                  <Link href={exerciseListHref({ muscleGroup })} className={`gap-2 ${HEADER_LINK}`}>
                    <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5 shrink-0">
                      <circle cx="5" cy="5" r="5" className={muscleColor(muscleGroup).fill} />
                    </svg>
                    {muscleGroup}
                  </Link>
                </th>
                {movementPatterns.map((pattern) => {
                  const count = filterExercises({ muscleGroup, movementPattern: pattern }).length;
                  return (
                    <td key={pattern} className="h-11 p-0 text-center">
                      {count > 0 ? (
                        <Link
                          href={exerciseListHref({ muscleGroup, movementPattern: pattern })}
                          className={`${heatClasses(count)} flex size-full min-h-11 items-center justify-center rounded-xl font-mono font-semibold tabular-nums transition hover:ring-2 hover:ring-zinc-900/30 focus-visible:outline-2 focus-visible:outline-sky-600 dark:hover:ring-white/40`}
                        >
                          {count}
                          <span className="sr-only">
                            {' '}
                            {pattern} exercises for {muscleGroup}
                          </span>
                        </Link>
                      ) : (
                        <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">
                          ·
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        aria-hidden="true"
        className="mt-4 flex flex-wrap items-center justify-end gap-2 font-mono text-xs text-zinc-600 dark:text-zinc-400"
      >
        {HEAT_LEVELS.toReversed().map((level) => (
          <span key={level.label} className={`${level.classes} rounded-md px-2 py-0.5`}>
            {level.label}
          </span>
        ))}
      </div>
    </div>
  );
}
