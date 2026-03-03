import Link from "next/link";
import { getAllExercises, getUniqueCategories, getUniqueMuscleGroups } from '@/lib/exerciseDb';

export default function Home() {
  const exercises = getAllExercises();
  const categories = getUniqueCategories();
  const muscleGroups = getUniqueMuscleGroups();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center py-16 px-8 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            WWWorkout
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-2">
            Your Exercise Database
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-500">
            {exercises.length} exercises • {categories.length} categories • {muscleGroups.length} muscle groups
          </p>
        </div>

        {/* Main Action Card */}
        <div className="w-full mb-12">
          <Link
            href="/exercises"
            className="group bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-zinc-200 dark:border-zinc-700 hover:scale-105 flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Browse & Search Exercises
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Search and filter exercises by name, category, muscle group, mechanics, or movement pattern.
              </p>
            </div>
            <svg
              className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform shrink-0 ml-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50 text-center">
            Quick Overview
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-100 dark:border-blue-800">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {exercises.length}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                Total Exercises
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-100 dark:border-green-800">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {categories.length}
              </p>
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                Categories
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center border border-purple-100 dark:border-purple-800">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {muscleGroups.length}
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                Muscle Groups
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 w-full">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50 text-center">
            Features
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="text-blue-500 mt-0.5">✓</div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Fast & Efficient</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">JSON-based mini database with instant loading</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="text-green-500 mt-0.5">✓</div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Advanced Filtering</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Filter by multiple criteria simultaneously</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="text-purple-500 mt-0.5">✓</div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Real-time Search</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Instant results as you type</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="text-orange-500 mt-0.5">✓</div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Detailed Info</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Mechanics, patterns, and muscle groups</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}