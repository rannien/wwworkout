import { getExerciseById, getAllExercises } from '@/lib/exerciseDb';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/app/components/Breadcrumb';
import CategoryBadge from '@/app/components/CategoryBadge';
import ExerciseCard from '@/app/components/ExerciseCard';
import MuscleBadge from '@/app/components/MuscleBadge';

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exercise = getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  // Score and rank exercises by both movement pattern match and muscle group overlap
  const similarExercises = getAllExercises()
    .filter(ex => ex.id !== exercise.id)
    .map(ex => {
      const samePattern = ex.movement_pattern === exercise.movement_pattern;
      const sharedMuscles = ex.muscle_groups.filter(mg => exercise.muscle_groups.includes(mg));
      const score = (samePattern ? 2 : 0) + sharedMuscles.length;
      return { ex, score, samePattern, sharedMuscles };
    })
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Exercises', href: '/exercises' },
        { label: exercise.name },
      ]} />

      <article className="glass mb-10 rounded-4xl p-6 sm:p-8">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {exercise.name}
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="exercise-info">
            <h2 id="exercise-info" className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Exercise Information
            </h2>
            <dl className="divide-y divide-zinc-900/10 dark:divide-white/10">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">Mechanics</dt>
                <dd className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-50">
                  {exercise.mechanics}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">Movement pattern</dt>
                <dd className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-50">
                  {exercise.movement_pattern}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">Category</dt>
                <dd className="flex flex-wrap justify-end gap-2">
                  {exercise.category.map(category => (
                    <CategoryBadge key={category} category={category} />
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="target-muscles">
            <h2 id="target-muscles" className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Target Muscle Groups
            </h2>
            <div className="flex flex-wrap gap-2">
              {exercise.muscle_groups.map(muscle => (
                <MuscleBadge key={muscle} muscle={muscle} size="md" />
              ))}
            </div>

            <div className="glass-strong mt-8 rounded-2xl p-4">
              <h3 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">Quick Info</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li><strong className="capitalize">{exercise.mechanics}</strong> movement</li>
                <li>Works <strong>{exercise.muscle_groups.length}</strong> muscle group{exercise.muscle_groups.length !== 1 ? 's' : ''}</li>
                <li><strong className="capitalize">{exercise.movement_pattern}</strong> movement pattern</li>
                <li><strong className="capitalize">{exercise.category.join(', ')}</strong> body exercise</li>
              </ul>
            </div>
          </section>
        </div>
      </article>

      {similarExercises.length > 0 && (
        <section aria-labelledby="similar-exercises" className="mb-10">
          <h2 id="similar-exercises" className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Similar Exercises
          </h2>
          <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
            Ranked by movement pattern &amp; muscle group match
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarExercises.map(({ ex: similar, samePattern, sharedMuscles }) => (
              <li key={similar.id} className="flex">
                <ExerciseCard id={similar.id} name={similar.name}>
                  <div className="flex flex-wrap gap-1.5">
                    {samePattern && (
                      <span className="inline-flex min-h-6 items-center rounded-full bg-white/50 px-2.5 py-1 text-xs font-medium capitalize text-zinc-800 ring-1 ring-inset ring-zinc-900/15 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/20">
                        {similar.movement_pattern}
                      </span>
                    )}
                    {sharedMuscles.map(muscle => (
                      <MuscleBadge key={muscle} muscle={muscle} />
                    ))}
                  </div>
                  <p className="mt-auto text-xs capitalize text-zinc-700 dark:text-zinc-300">
                    {similar.mechanics}
                  </p>
                </ExerciseCard>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href="/exercises"
        className="inline-flex rounded-full bg-sky-700 px-6 py-3 font-medium text-white shadow-lg shadow-sky-700/30 transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        ← Back to all exercises
      </Link>
    </>
  );
}

export async function generateStaticParams() {
  const exercises = getAllExercises();
  return exercises.map(exercise => ({
    id: exercise.id,
  }));
}
