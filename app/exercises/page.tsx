import ExerciseSearch from '@/app/components/ExerciseSearch';
import Breadcrumb from '@/app/components/Breadcrumb';

export default function ExercisesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="container mx-auto max-w-5xl px-8">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Exercises' },
        ]} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Exercise Database
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