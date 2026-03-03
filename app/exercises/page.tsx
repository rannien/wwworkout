import Link from 'next/link';
import { getAllExercises, getUniqueCategories, getUniqueMuscleGroups, getExerciseStats } from '@/lib/exerciseDb';
import Breadcrumb from '@/app/components/Breadcrumb';

export default function ExercisesPage() {
  const exercises = getAllExercises();
  const categories = getUniqueCategories();
  const muscleGroups = getUniqueMuscleGroups();
  const stats = getExerciseStats();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto p-8 max-w-5xl">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Exercises' },
        ]} />

        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          Exercise Database
        </h1>
        
        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
              Total Exercises
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
              Categories
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {categories.length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
              Muscle Groups
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {muscleGroups.length}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Categories
          </h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <span 
                key={cat} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Muscle Groups */}
        <div className="mb-8 bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Muscle Groups
          </h2>
          <div className="flex gap-2 flex-wrap">
            {muscleGroups.map(mg => (
              <span 
                key={mg} 
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium"
              >
                {mg}
              </span>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">
            All Exercises
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map(exercise => (
              <Link
                key={exercise.id}
                href={`/exercises/${exercise.id}`}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <h3 className="font-bold text-lg mb-3 text-zinc-900 dark:text-zinc-50">
                  {exercise.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Type: </span>
                    <span className="text-zinc-600 dark:text-zinc-400 capitalize">{exercise.mechanics}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Pattern: </span>
                    <span className="text-zinc-600 dark:text-zinc-400 capitalize">{exercise.movement_pattern}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Category: </span>
                    <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                      {exercise.category.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Muscles: </span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {exercise.muscle_groups.map(muscle => (
                        <span 
                          key={muscle}
                          className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs capitalize"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center text-zinc-600 dark:text-zinc-400">
          <p className="text-sm">
            Total exercises loaded: <span className="font-semibold">{exercises.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}