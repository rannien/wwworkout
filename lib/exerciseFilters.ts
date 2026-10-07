import type { Exercise } from './exerciseDb';

export interface ExerciseFilters {
  query: string;
  category: string;
  muscleGroup: string;
  mechanics: string;
  movementPattern: string;
}

export type ExerciseFilterCriteria = Partial<ExerciseFilters>;

export interface ExerciseFilterOptions {
  categories: string[];
  muscleGroups: string[];
  mechanics: string[];
  movementPatterns: string[];
}

export type FilterableExercise = Pick<
  Exercise,
  'name' | 'category' | 'movement_pattern' | 'mechanics' | 'muscle_groups'
>;

export const EMPTY_EXERCISE_FILTERS: ExerciseFilters = {
  query: '',
  category: '',
  muscleGroup: '',
  mechanics: '',
  movementPattern: '',
};

export const MAX_QUERY_LENGTH = 100;

export function matchesExerciseFilters(exercise: FilterableExercise, criteria: ExerciseFilterCriteria): boolean {
  const query = criteria.query?.trim().toLowerCase();
  if (query) {
    const matchesQuery =
      exercise.name.toLowerCase().includes(query) ||
      exercise.muscle_groups.some((mg) => mg.toLowerCase().includes(query)) ||
      exercise.movement_pattern.toLowerCase().includes(query);
    if (!matchesQuery) return false;
  }

  if (criteria.category && !exercise.category.includes(criteria.category.toLowerCase())) {
    return false;
  }

  if (criteria.muscleGroup) {
    const muscleGroup = criteria.muscleGroup.toLowerCase();
    if (!exercise.muscle_groups.some((mg) => mg.toLowerCase() === muscleGroup)) return false;
  }

  if (criteria.mechanics && exercise.mechanics.toLowerCase() !== criteria.mechanics.toLowerCase()) {
    return false;
  }

  if (criteria.movementPattern && exercise.movement_pattern.toLowerCase() !== criteria.movementPattern.toLowerCase()) {
    return false;
  }

  return true;
}

function matchOption(value: string | null, options: string[]): string {
  const lowerValue = value?.toLowerCase();
  return options.find((option) => option.toLowerCase() === lowerValue) ?? '';
}

export function parseExerciseFilters(params: URLSearchParams, options: ExerciseFilterOptions): ExerciseFilters {
  return {
    query: (params.get('q') ?? '').slice(0, MAX_QUERY_LENGTH),
    category: matchOption(params.get('category'), options.categories),
    muscleGroup: matchOption(params.get('muscleGroup'), options.muscleGroups),
    mechanics: matchOption(params.get('mechanics'), options.mechanics),
    movementPattern: matchOption(params.get('movementPattern'), options.movementPatterns),
  };
}

export function exerciseFiltersToSearchParams(filters: Partial<ExerciseFilters>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.category) params.set('category', filters.category);
  if (filters.muscleGroup) params.set('muscleGroup', filters.muscleGroup);
  if (filters.mechanics) params.set('mechanics', filters.mechanics);
  if (filters.movementPattern) params.set('movementPattern', filters.movementPattern);
  return params;
}

export function exerciseListHref(filters: Partial<ExerciseFilters> = {}): string {
  const search = exerciseFiltersToSearchParams(filters).toString();
  return search ? `/exercises?${search}` : '/exercises';
}

export function hasActiveExerciseFilters(filters: ExerciseFilters): boolean {
  return Boolean(
    filters.query || filters.category || filters.muscleGroup || filters.mechanics || filters.movementPattern,
  );
}
