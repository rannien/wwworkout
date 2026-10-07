import Link from 'next/link';
import {
  filterByMovementPattern,
  getAllExercises,
  getExerciseStats,
  getMuscleGroupStats,
  getUniqueMovementPatterns,
} from '@/lib/exerciseDb';
import BodyMap from '@/app/components/BodyMap';
import CategoryBadge from '@/app/components/CategoryBadge';
import MuscleMatrix from '@/app/components/MuscleMatrix';

export default function Home() {
  const exercises = getAllExercises();
  const stats = getExerciseStats();
  const muscleGroupStats = getMuscleGroupStats();
  const movementIndex = getUniqueMovementPatterns()
    .map(pattern => ({
      pattern,
      exercises: filterByMovementPattern(pattern).toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
    .toSorted((a, b) => b.exercises.length - a.exercises.length);

  return (
    <div className="flex flex-col gap-20">
      <section aria-labelledby="hero-title" className="grid items-center gap-10 pt-4 lg:grid-cols-[1fr_1.05fr] lg:pt-10">
        <div>
          <p className="mb-5 font-mono text-xs tracking-widest text-zinc-700 uppercase dark:text-zinc-300">
            {exercises.length} exercises · {muscleGroupStats.length} muscle groups · {movementIndex.length} movement patterns
          </p>
          <h1 id="hero-title" className="mb-6 text-5xl leading-[0.95] font-bold tracking-tighter text-zinc-900 sm:text-7xl dark:text-zinc-50">
            Pick a muscle.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">Get every exercise that hits it.</span>
          </h1>
          <p className="mb-8 max-w-md text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            From Deadlifts to Concentration Curls — each exercise is tagged with the muscles it works, how it
            moves, and whether it&apos;s a compound or isolation lift.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/exercises"
              className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse all {exercises.length} →
            </Link>
            {stats.byCategory.map(({ category, count }) => (
              <CategoryBadge key={category} category={category} size="md" count={count} />
            ))}
          </div>
        </div>

        <BodyMap muscleGroups={muscleGroupStats} />
      </section>

      <section aria-labelledby="muscle-map">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="muscle-map" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            The map
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">Every exercise by muscle and movement. Empty cells are gaps.</p>
        </div>
        <MuscleMatrix
          muscleGroups={muscleGroupStats.map(({ muscleGroup }) => muscleGroup)}
          movementPatterns={movementIndex.map(({ pattern }) => pattern)}
        />
      </section>

      <section aria-labelledby="movement-index">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="movement-index" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            The index
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">All {exercises.length} exercises, grouped by how they move.</p>
        </div>
        <div className="glass divide-y divide-zinc-900/10 rounded-4xl px-5 sm:px-8 dark:divide-white/10">
          {movementIndex.map(({ pattern, exercises: patternExercises }) => (
            <section
              key={pattern}
              aria-labelledby={`pattern-${pattern}`}
              className="grid gap-3 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <h3 id={`pattern-${pattern}`} className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold tracking-tight text-zinc-900 capitalize dark:text-zinc-50">{pattern}</span>
                <span className="font-mono text-sm text-zinc-600 tabular-nums dark:text-zinc-400">
                  {patternExercises.length}
                  <span className="sr-only"> exercises</span>
                </span>
              </h3>
              <ul className="flex flex-wrap gap-x-1 gap-y-1.5 self-center">
                {patternExercises.map((exercise, index) => (
                  <li key={exercise.id} className="flex items-center gap-1">
                    <Link
                      href={`/exercises/${exercise.id}`}
                      className="rounded-md px-0.5 text-zinc-800 underline decoration-zinc-900/20 underline-offset-4 transition hover:text-zinc-950 hover:decoration-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-200 dark:decoration-white/25 dark:hover:text-white dark:hover:decoration-white"
                    >
                      {exercise.name}
                    </Link>
                    {index < patternExercises.length - 1 && (
                      <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">/</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
