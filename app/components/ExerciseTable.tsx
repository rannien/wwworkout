import Link from 'next/link';
import type { Exercise } from '@/lib/exerciseDb';
import type { ExerciseSort } from '@/lib/exerciseList';
import CategoryBadge from '@/app/components/CategoryBadge';
import MuscleBadge from '@/app/components/MuscleBadge';

interface ExerciseTableProps {
  caption: string;
  exercises: Exercise[];
  sortBy: ExerciseSort;
  onSort: (sortBy: ExerciseSort) => void;
}

const SORTABLE_COLUMNS: { sortBy: ExerciseSort; label: string }[] = [
  { sortBy: 'name', label: 'Name' },
  { sortBy: 'movementPattern', label: 'Pattern' },
  { sortBy: 'mechanics', label: 'Mechanics' },
];

const HEADER_CELL = 'px-4 py-3 text-xs font-semibold tracking-wide text-zinc-700 uppercase dark:text-zinc-300';

export default function ExerciseTable({ caption, exercises, sortBy, onSort }: ExerciseTableProps) {
  return (
    <div className="glass relative overflow-x-auto rounded-3xl">
      <table className="w-full min-w-4xl table-fixed text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col />
          <col className="w-32" />
          <col className="w-36" />
          <col className="w-28" />
          <col className="w-80" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-900/10 dark:border-white/10">
            {SORTABLE_COLUMNS.map((column) => {
              const active = sortBy === column.sortBy;
              return (
                <th
                  key={column.sortBy}
                  scope="col"
                  aria-sort={active ? 'ascending' : undefined}
                  className={HEADER_CELL}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.sortBy)}
                    className="inline-flex min-h-6 items-center gap-1 rounded-md tracking-wide uppercase hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-sky-600 dark:hover:text-white"
                  >
                    {column.label}
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={`size-3.5 fill-none stroke-current stroke-2 ${active ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </th>
              );
            })}
            <th scope="col" className={HEADER_CELL}>
              Category
            </th>
            <th scope="col" className={HEADER_CELL}>
              Muscles
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/10 dark:divide-white/10">
          {exercises.map((exercise) => (
            <tr key={exercise.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
              <th scope="row" className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                <Link
                  href={`/exercises/${exercise.id}`}
                  className="rounded-md underline decoration-zinc-900/20 underline-offset-4 hover:decoration-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-600 dark:decoration-white/25 dark:hover:decoration-white"
                >
                  {exercise.name}
                </Link>
              </th>
              <td className="px-4 py-3 text-zinc-700 capitalize dark:text-zinc-300">{exercise.movement_pattern}</td>
              <td className="px-4 py-3 text-zinc-700 capitalize dark:text-zinc-300">{exercise.mechanics}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {exercise.category.map((category) => (
                    <CategoryBadge key={category} category={category} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {exercise.muscle_groups.map((muscle) => (
                    <MuscleBadge key={muscle} muscle={muscle} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
