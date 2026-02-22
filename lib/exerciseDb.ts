import exercisesData from '../exercises-latest.json';

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
  return getAllExercises().find(ex => ex.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return getAllExercises().filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.muscle_groups.some(mg => mg.toLowerCase().includes(lowerQuery)) ||
    ex.movement_pattern.toLowerCase().includes(lowerQuery)
  );
}

export function filterByCategory(category: string): Exercise[] {
  return getAllExercises().filter(ex =>
    ex.category.includes(category.toLowerCase())
  );
}

export function filterByMuscleGroup(muscleGroup: string): Exercise[] {
  const lowerMuscle = muscleGroup.toLowerCase();
  return getAllExercises().filter(ex =>
    ex.muscle_groups.some(mg => mg.toLowerCase() === lowerMuscle)
  );
}

export function filterByMechanics(mechanics: string): Exercise[] {
  return getAllExercises().filter(ex =>
    ex.mechanics.toLowerCase() === mechanics.toLowerCase()
  );
}

export function filterByMovementPattern(pattern: string): Exercise[] {
  return getAllExercises().filter(ex =>
    ex.movement_pattern.toLowerCase() === pattern.toLowerCase()
  );
}

// Advanced filter with multiple criteria
export function filterExercises(filters: {
  query?: string;
  category?: string;
  muscleGroup?: string;
  mechanics?: string;
  movementPattern?: string;
}): Exercise[] {
  let exercises = getAllExercises();

  if (filters.query) {
    exercises = exercises.filter(ex => {
      const lowerQuery = filters.query!.toLowerCase();
      return (
        ex.name.toLowerCase().includes(lowerQuery) ||
        ex.muscle_groups.some(mg => mg.toLowerCase().includes(lowerQuery)) ||
        ex.movement_pattern.toLowerCase().includes(lowerQuery)
      );
    });
  }

  if (filters.category) {
    exercises = exercises.filter(ex =>
      ex.category.includes(filters.category!.toLowerCase())
    );
  }

  if (filters.muscleGroup) {
    const lowerMuscle = filters.muscleGroup.toLowerCase();
    exercises = exercises.filter(ex =>
      ex.muscle_groups.some(mg => mg.toLowerCase() === lowerMuscle)
    );
  }

  if (filters.mechanics) {
    exercises = exercises.filter(ex =>
      ex.mechanics.toLowerCase() === filters.mechanics!.toLowerCase()
    );
  }

  if (filters.movementPattern) {
    exercises = exercises.filter(ex =>
      ex.movement_pattern.toLowerCase() === filters.movementPattern!.toLowerCase()
    );
  }

  return exercises;
}

// Get unique values for filters
export function getUniqueCategories(): string[] {
  const categories = getAllExercises().flatMap(ex => ex.category);
  return [...new Set(categories)].sort();
}

export function getUniqueMuscleGroups(): string[] {
  const muscleGroups = getAllExercises().flatMap(ex => ex.muscle_groups);
  return [...new Set(muscleGroups)].sort();
}

export function getUniqueMechanics(): string[] {
  const mechanics = getAllExercises().map(ex => ex.mechanics);
  return [...new Set(mechanics)].sort();
}

export function getUniqueMovementPatterns(): string[] {
  const patterns = getAllExercises().map(ex => ex.movement_pattern);
  return [...new Set(patterns)].sort();
}

// Statistics
export function getExerciseStats() {
  const exercises = getAllExercises();
  return {
    total: exercises.length,
    byCategory: getUniqueCategories().map(cat => ({
      category: cat,
      count: filterByCategory(cat).length
    })),
    byMechanics: getUniqueMechanics().map(mech => ({
      mechanics: mech,
      count: filterByMechanics(mech).length
    })),
    byMovementPattern: getUniqueMovementPatterns().map(pattern => ({
      pattern,
      count: filterByMovementPattern(pattern).length
    }))
  };
}