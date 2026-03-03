import ExerciseSearch from '@/app/components/ExerciseSearch';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="container mx-auto max-w-5xl px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Exercise Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Find exercises by name, muscle group, category, or movement pattern
          </p>
        </div>
        
        <ExerciseSearch />
      </div>
    </div>
  );
}