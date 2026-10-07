import { connection } from 'next/server';
import ExerciseSearch from '@/app/components/ExerciseSearch';
import Breadcrumb from '@/app/components/Breadcrumb';
import { getAllExercises, getExerciseFilterOptions } from '@/lib/exerciseDb';

export default async function ExercisesPage() {
  await connection();

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Exercises' }]} />

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Exercise Database</h1>
        <p className="text-zinc-700 dark:text-zinc-300">
          Find exercises by name, muscle group, category, or mechanics — or tap any badge to filter.
        </p>
      </div>

      <ExerciseSearch exercises={getAllExercises()} filterOptions={getExerciseFilterOptions()} />
    </>
  );
}
