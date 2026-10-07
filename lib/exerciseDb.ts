import exercisesData from '../exercises-latest.json';
import { matchesExerciseFilters, type ExerciseFilterCriteria, type ExerciseFilterOptions } from './exerciseFilters';

export interface Exercise {
  id: string;
  name: string;
  category: string[];
  movement_pattern: string;
  mechanics: string;
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
  updated_by_id: string | null;
  muscle_groups: string[];
}

// Transform the SQL-like format to an array of objects
function parseExercises(): Exercise[] {
  // The JSON is an array with one object containing the data
  const data = exercisesData[0];
  const headers = data.header;
  return data.rows.map((row: (string | string[])[]) => {
    const exercise: Record<string, string | string[] | null> = {};
    headers.forEach((header: string, index: number) => {
      exercise[header] = row[index] === 'NULL' ? null : row[index];
    });
    return exercise as unknown as Exercise;
  });
}

// Cache the parsed exercises
let cachedExercises: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!cachedExercises) {
    cachedExercises = parseExercises();
  }
  return cachedExercises;
}

export function getExerciseById(id: string): Exercise | undefined {
  return getAllExercises().find((ex) => ex.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return getAllExercises().filter(
    (ex) =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.muscle_groups.some((mg) => mg.toLowerCase().includes(lowerQuery)) ||
      ex.movement_pattern.toLowerCase().includes(lowerQuery),
  );
}

export function filterByCategory(category: string): Exercise[] {
  return getAllExercises().filter((ex) => ex.category.includes(category.toLowerCase()));
}

export function filterByMuscleGroup(muscleGroup: string): Exercise[] {
  const lowerMuscle = muscleGroup.toLowerCase();
  return getAllExercises().filter((ex) => ex.muscle_groups.some((mg) => mg.toLowerCase() === lowerMuscle));
}

export function filterByMechanics(mechanics: string): Exercise[] {
  return getAllExercises().filter((ex) => ex.mechanics.toLowerCase() === mechanics.toLowerCase());
}

export function filterByMovementPattern(pattern: string): Exercise[] {
  return getAllExercises().filter((ex) => ex.movement_pattern.toLowerCase() === pattern.toLowerCase());
}

export function filterExercises(criteria: ExerciseFilterCriteria): Exercise[] {
  return getAllExercises().filter((ex) => matchesExerciseFilters(ex, criteria));
}

// Get unique values for filters
export function getUniqueCategories(): string[] {
  const categories = getAllExercises().flatMap((ex) => ex.category);
  return [...new Set(categories)].toSorted();
}

export function getUniqueMuscleGroups(): string[] {
  const muscleGroups = getAllExercises().flatMap((ex) => ex.muscle_groups);
  return [...new Set(muscleGroups)].toSorted();
}

export function getUniqueMechanics(): string[] {
  const mechanics = getAllExercises().map((ex) => ex.mechanics);
  return [...new Set(mechanics)].toSorted();
}

export function getUniqueMovementPatterns(): string[] {
  const patterns = getAllExercises().map((ex) => ex.movement_pattern);
  return [...new Set(patterns)].toSorted();
}

export function getExerciseFilterOptions(): ExerciseFilterOptions {
  return {
    categories: getUniqueCategories(),
    muscleGroups: getUniqueMuscleGroups(),
    mechanics: getUniqueMechanics(),
    movementPatterns: getUniqueMovementPatterns(),
  };
}

export function getMuscleGroupStats(): { muscleGroup: string; count: number }[] {
  return getUniqueMuscleGroups()
    .map((muscleGroup) => ({ muscleGroup, count: filterByMuscleGroup(muscleGroup).length }))
    .toSorted((a, b) => b.count - a.count);
}

// Statistics
export function getExerciseStats() {
  const exercises = getAllExercises();
  return {
    total: exercises.length,
    byCategory: getUniqueCategories().map((cat) => ({
      category: cat,
      count: filterByCategory(cat).length,
    })),
    byMechanics: getUniqueMechanics().map((mech) => ({
      mechanics: mech,
      count: filterByMechanics(mech).length,
    })),
    byMovementPattern: getUniqueMovementPatterns().map((pattern) => ({
      pattern,
      count: filterByMovementPattern(pattern).length,
    })),
  };
}
