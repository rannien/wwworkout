import { getExerciseById, getAllExercises, filterByMovementPattern } from '@/lib/exerciseDb';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const exercise = getExerciseById(params.id);

  if (!exercise) {
    notFound();
  }

  // Find similar exercises based on movement pattern and muscle groups
  const similarExercises = getAllExercises()
    .filter(ex => 
      ex.id !== exercise.id && (
        ex.movement_pattern === exercise.movement_pattern ||
        ex.muscle_groups.some(mg => exercise.muscle_groups.includes(mg))
      )
    )
    .slice(0, 6);

  // Find alternatives with same movement pattern
  const alternatives = filterByMovementPattern(exercise.movement_pattern)
    .filter(ex => ex.id !== exercise.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto p-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Home
          </Link>
          <span className="mx-2 text-zinc-400">/</span>
          <Link href="/exercises" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Exercises
          </Link>
          <span className="mx-2 text-zinc-400">/</span>
          <span className="text-zinc-600 dark:text-zinc-400">{exercise.name}</span>
        </nav>

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
                  <span 
                    key={muscle}
                    className="px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 rounded-lg font-medium capitalize"
                  >
                    {muscle}
                  </span>
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

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              Alternative Exercises
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-2">
                (Same movement pattern)
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alternatives.map(alt => (
                <Link
                  key={alt.id}
                  href={`/exercises/${alt.id}`}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    {alt.name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">
                    {alt.mechanics}
                  </p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {alt.muscle_groups.slice(0, 2).map(muscle => (
                      <span 
                        key={muscle}
                        className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs capitalize"
                      >
                        {muscle}
                      </span>
                    ))}
                    {alt.muscle_groups.length > 2 && (
                      <span className="px-2 py-0.5 text-zinc-500 text-xs">
                        +{alt.muscle_groups.length - 2} more
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similar Exercises Section */}
        {similarExercises.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
              Similar Exercises
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-2">
                (Similar muscle groups)
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarExercises.map(similar => (
                <Link
                  key={similar.id}
                  href={`/exercises/${similar.id}`}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-2">
                    {similar.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Pattern: </span>
                      <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                        {similar.movement_pattern}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Type: </span>
                      <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                        {similar.mechanics}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {similar.muscle_groups.map(muscle => (
                        <span 
                          key={muscle}
                          className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs capitalize"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
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