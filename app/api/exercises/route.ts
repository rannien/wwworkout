import { NextRequest, NextResponse } from 'next/server';
import { 
  filterExercises,
  getUniqueCategories,
  getUniqueMuscleGroups,
  getUniqueMechanics,
  getUniqueMovementPatterns,
  getExerciseStats
} from '@/lib/exerciseDb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const muscleGroup = searchParams.get('muscleGroup');
  const mechanics = searchParams.get('mechanics');
  const pattern = searchParams.get('pattern');
  const stats = searchParams.get('stats');
  const filters = searchParams.get('filters');

  // Return filter options if requested
  if (filters === 'true') {
    return NextResponse.json({
      categories: getUniqueCategories(),
      muscleGroups: getUniqueMuscleGroups(),
      mechanics: getUniqueMechanics(),
      movementPatterns: getUniqueMovementPatterns()
    });
  }

  // Return stats if requested
  if (stats === 'true') {
    return NextResponse.json(getExerciseStats());
  }

  // Filter exercises based on query parameters
  const exercises = filterExercises({
    query: query || undefined,
    category: category || undefined,
    muscleGroup: muscleGroup || undefined,
    mechanics: mechanics || undefined,
    movementPattern: pattern || undefined
  });

  return NextResponse.json({ 
    exercises, 
    count: exercises.length,
    filters: {
      query,
      category,
      muscleGroup,
      mechanics,
      pattern
    }
  });
}