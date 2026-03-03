import { getExerciseById, getAllExercises } from '@/lib/exerciseDb';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/app/components/Breadcrumb';
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
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto p-8 max-w-5xl">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Exercises', href: '/exercises' },
          { label: exercise.name },
        ]} />

        {/* Main Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
            {exercise.name}
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  Exercise Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      Mechanics:
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium capitalize">
                      {exercise.mechanics}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      Movement Pattern:
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium capitalize">
                      {exercise.movement_pattern}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      Category:
                    </span>
                    <div className="flex gap-2">
                      {exercise.category.map(cat => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm font-medium capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Muscle Groups */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                Target Muscle Groups
              </h2>
              <div className="flex flex-wrap gap-2">
                {exercise.muscle_groups.map(muscle => (
                  <MuscleBadge key={muscle} muscle={muscle} size="md" />
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                  Quick Info
                </h3>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• <strong>{exercise.mechanics === 'compound' ? 'Multi-joint' : 'Single-joint'}</strong> movement</li>
                  <li>• Works <strong>{exercise.muscle_groups.length}</strong> muscle group{exercise.muscle_groups.length !== 1 ? 's' : ''}</li>
                  <li>• <strong className="capitalize">{exercise.movement_pattern}</strong> movement pattern</li>
                  <li>• <strong className="capitalize">{exercise.category.join(', ')}</strong> body exercise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Exercises Section */}
        {similarExercises.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              Similar Exercises
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-2">
                (Ranked by movement pattern & muscle group match)
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarExercises.map(({ ex: similar, samePattern, sharedMuscles }) => (
                <Link
                  key={similar.id}
                  href={`/exercises/${similar.id}`}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col gap-2"
                >
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                    {similar.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {samePattern && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-xs font-medium capitalize">
                        {similar.movement_pattern}
                      </span>
                    )}
                    {sharedMuscles.map(muscle => (
                      <MuscleBadge key={muscle} muscle={muscle} size="sm" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize mt-auto">
                    {similar.mechanics}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/exercises"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            ← Back to All Exercises
          </Link>
          <Link
            href="/exercises/search"
            className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium transition"
          >
            Search Exercises
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all exercises at build time
export async function generateStaticParams() {
  const exercises = getAllExercises();
  return exercises.map(exercise => ({
    id: exercise.id,
  }));
}