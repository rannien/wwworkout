import type { Exercise } from './exerciseDb';

export type ExerciseLayout = 'cards' | 'table';
export type ExerciseGrouping = 'none' | 'movementPattern' | 'muscleGroup';
export type ExerciseSort = 'name' | 'movementPattern' | 'mechanics';

export interface ExerciseListView {
  layout: ExerciseLayout;
  groupBy: ExerciseGrouping;
  sortBy: ExerciseSort;
}

export interface ExerciseGroup<T> {
  key: string;
  exercises: T[];
}

export type ListableExercise = Pick<Exercise, 'name' | 'movement_pattern' | 'mechanics' | 'muscle_groups'>;

export const DEFAULT_EXERCISE_LIST_VIEW: ExerciseListView = {
  layout: 'cards',
  groupBy: 'none',
  sortBy: 'name',
};

const LAYOUTS: readonly ExerciseLayout[] = ['cards', 'table'];
const GROUPINGS: readonly ExerciseGrouping[] = ['none', 'movementPattern', 'muscleGroup'];
const SORTS: readonly ExerciseSort[] = ['name', 'movementPattern', 'mechanics'];

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.find((option) => option === value) ?? fallback;
}

export function parseExerciseGrouping(value: string | null, fallback: ExerciseGrouping): ExerciseGrouping {
  return pick(value, GROUPINGS, fallback);
}

export function parseExerciseListView(params: URLSearchParams, fallback: ExerciseListView): ExerciseListView {
  return {
    layout: pick(params.get('layout'), LAYOUTS, fallback.layout),
    groupBy: parseExerciseGrouping(params.get('groupBy'), fallback.groupBy),
    sortBy: pick(params.get('sortBy'), SORTS, fallback.sortBy),
  };
}

export function exerciseListViewToSearchParams(view: ExerciseListView, params: URLSearchParams): URLSearchParams {
  const result = new URLSearchParams(params);
  if (view.layout !== DEFAULT_EXERCISE_LIST_VIEW.layout) result.set('layout', view.layout);
  if (view.groupBy !== DEFAULT_EXERCISE_LIST_VIEW.groupBy) result.set('groupBy', view.groupBy);
  if (view.sortBy !== DEFAULT_EXERCISE_LIST_VIEW.sortBy) result.set('sortBy', view.sortBy);
  return result;
}

function sortValue(exercise: ListableExercise, sortBy: ExerciseSort): string {
  switch (sortBy) {
    case 'name':
      return exercise.name;
    case 'movementPattern':
      return exercise.movement_pattern;
    case 'mechanics':
      return exercise.mechanics;
  }
}

export function sortExercises<T extends ListableExercise>(exercises: T[], sortBy: ExerciseSort): T[] {
  return exercises.toSorted(
    (a, b) => sortValue(a, sortBy).localeCompare(sortValue(b, sortBy)) || a.name.localeCompare(b.name),
  );
}

function groupKeys(exercise: ListableExercise, groupBy: ExerciseGrouping): string[] {
  switch (groupBy) {
    case 'none':
      return [''];
    case 'movementPattern':
      return [exercise.movement_pattern];
    case 'muscleGroup':
      return exercise.muscle_groups;
  }
}

export function groupExercises<T extends ListableExercise>(
  exercises: T[],
  groupBy: ExerciseGrouping,
): ExerciseGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const exercise of exercises) {
    for (const key of groupKeys(exercise, groupBy)) {
      const group = groups.get(key);
      if (group) group.push(exercise);
      else groups.set(key, [exercise]);
    }
  }
  return [...groups]
    .map(([key, members]) => ({ key, exercises: members }))
    .toSorted((a, b) => b.exercises.length - a.exercises.length || a.key.localeCompare(b.key));
}
