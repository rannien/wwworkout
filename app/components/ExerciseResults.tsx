import type { Exercise } from '@/lib/exerciseDb';
import { groupExercises, type ExerciseListView, type ExerciseSort } from '@/lib/exerciseList';
import CategoryBadge from '@/app/components/CategoryBadge';
import ExerciseCard from '@/app/components/ExerciseCard';
import ExerciseTable from '@/app/components/ExerciseTable';
import MuscleBadge from '@/app/components/MuscleBadge';

interface ExerciseResultsProps {
  exercises: Exercise[];
  view: ExerciseListView;
  onSort: (sortBy: ExerciseSort) => void;
}

function ExerciseCardGrid({ exercises }: { exercises: Exercise[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exercises.map(exercise => (
        <li key={exercise.id} className="flex">
          <ExerciseCard id={exercise.id} name={exercise.name}>
            <p className="text-sm capitalize text-zinc-700 dark:text-zinc-300">
              {exercise.mechanics} · {exercise.movement_pattern}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {exercise.category.map(category => (
                <CategoryBadge key={category} category={category} />
              ))}
              {exercise.muscle_groups.map(muscle => (
                <MuscleBadge key={muscle} muscle={muscle} />
              ))}
            </div>
          </ExerciseCard>
        </li>
      ))}
    </ul>
  );
}

export default function ExerciseResults({ exercises, view, onSort }: ExerciseResultsProps) {
  const grouped = view.groupBy !== 'none';
  const groups = groupExercises(exercises, view.groupBy);

  return (
    <div className="flex flex-col gap-10">
      {!grouped && <h2 className="sr-only">Results</h2>}
      {groups.map(group => (
        <section key={group.key}>
          {grouped && (
            <h2 className="mb-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold tracking-tight text-zinc-900 capitalize dark:text-zinc-50">{group.key}</span>
              <span className="font-mono text-sm text-zinc-600 tabular-nums dark:text-zinc-400">
                {group.exercises.length}
                <span className="sr-only"> exercises</span>
              </span>
            </h2>
          )}
          {view.layout === 'table' ? (
            <ExerciseTable
              caption={grouped ? group.key : 'Exercises'}
              exercises={group.exercises}
              sortBy={view.sortBy}
              onSort={onSort}
            />
          ) : (
            <ExerciseCardGrid exercises={group.exercises} />
          )}
        </section>
      ))}
    </div>
  );
}
