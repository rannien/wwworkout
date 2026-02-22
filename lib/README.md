# Exercise Database Documentation

This mini database system uses a JSON file (`exercises-latest.json`) as a data source and provides a type-safe, efficient API for querying exercise data.

## Architecture

The database consists of three main components:

1. **Data Layer** (`lib/exerciseDb.ts`) - Core database functions
2. **API Routes** (`app/api/exercises/route.ts`) - REST API endpoints
3. **UI Components** - Server and client components for displaying data

## Data Structure

Each exercise has the following properties:

```typescript
interface Exercise {
  id: string;
  name: string;
  category: string[];           // e.g., ["lower", "upper"]
  movement_pattern: string;      // e.g., "squat", "push", "pull"
  mechanics: string;             // "compound" or "isolation"
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
  updated_by_id: string | null;
  muscle_groups: string[];       // e.g., ["quadriceps", "glutes"]
}
```

## Usage Examples

### 1. Server Components (Recommended for Static Data)

Use direct imports for server-side rendering or static site generation:

```tsx
import { getAllExercises, filterByCategory } from '@/lib/exerciseDb';

export default function ExercisesPage() {
  const exercises = getAllExercises();
  const lowerBodyExercises = filterByCategory('lower');
  
  return (
    <div>
      <h1>All Exercises ({exercises.length})</h1>
      {exercises.map(ex => (
        <div key={ex.id}>{ex.name}</div>
      ))}
    </div>
  );
}
```

### 2. API Routes (For Client-Side Filtering)

Fetch exercises dynamically with filters:

```typescript
// GET /api/exercises?q=squat&category=lower&muscleGroup=quadriceps

const response = await fetch('/api/exercises?q=squat&category=lower');
const { exercises, count } = await response.json();
```

Available query parameters:
- `q` - Search by name, muscle group, or movement pattern
- `category` - Filter by category
- `muscleGroup` - Filter by specific muscle group
- `mechanics` - Filter by mechanics type (compound/isolation)
- `pattern` - Filter by movement pattern
- `filters=true` - Get all available filter options
- `stats=true` - Get database statistics

### 3. Client Components

Use the API for interactive filtering:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ExerciseSearch() {
  const [exercises, setExercises] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`/api/exercises?q=${query}`)
      .then(res => res.json())
      .then(data => setExercises(data.exercises));
  }, [query]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search exercises..."
      />
      {/* Display results */}
    </div>
  );
}
```

## Available Functions

### Query Functions

- `getAllExercises()` - Returns all exercises
- `getExerciseById(id)` - Get single exercise by ID
- `searchExercises(query)` - Search by name, muscle group, or pattern
- `filterByCategory(category)` - Filter by category
- `filterByMuscleGroup(muscleGroup)` - Filter by muscle group
- `filterByMechanics(mechanics)` - Filter by mechanics type
- `filterByMovementPattern(pattern)` - Filter by movement pattern
- `filterExercises(filters)` - Advanced multi-criteria filtering

### Metadata Functions

- `getUniqueCategories()` - Get all unique categories
- `getUniqueMuscleGroups()` - Get all unique muscle groups
- `getUniqueMechanics()` - Get all mechanics types
- `getUniqueMovementPatterns()` - Get all movement patterns
- `getExerciseStats()` - Get comprehensive statistics

## Performance Optimization

The database uses **in-memory caching**:

```typescript
let cachedExercises: Exercise[] | null = null;

export function getAllExercises(): Exercise[] {
  if (!cachedExercises) {
    cachedExercises = parseExercises();
  }
  return cachedExercises;
}
```

Benefits:
- ✅ JSON is parsed only once
- ✅ Subsequent calls are instant
- ✅ No database connection overhead
- ✅ Perfect for static or rarely-changing data

## When to Use This Approach

### ✅ Good For:
- Read-heavy applications
- Static or rarely-changing data
- Small to medium datasets (< 10MB)
- Quick prototypes and MVPs
- Applications without user-generated content

### ❌ Consider a Real Database When:
- Need to add/edit/delete data frequently
- Multiple users creating content
- Complex relationships between entities
- Dataset grows beyond 10MB
- Need advanced querying (joins, aggregations)
- Require data persistence across deployments

## Example Use Cases

### 1. Workout Plan Builder
```tsx
import { filterByMuscleGroup, filterByMechanics } from '@/lib/exerciseDb';

// Get compound exercises for legs
const legDay = filterByMechanics('compound')
  .filter(ex => ex.category.includes('lower'));
```

### 2. Progressive Overload Tracker
```tsx
import { getExerciseById } from '@/lib/exerciseDb';

const exercise = getExerciseById('1'); // Deadlift
// Track sets, reps, weight for this exercise
```

### 3. Exercise Recommendation Engine
```tsx
import { filterByMovementPattern } from '@/lib/exerciseDb';

// Suggest similar exercises
const pullExercises = filterByMovementPattern('pull');
```

## Extending the Database

To add new query functions, edit `lib/exerciseDb.ts`:

```typescript
export function filterByDifficulty(difficulty: string): Exercise[] {
  return getAllExercises().filter(ex => 
    ex.difficulty === difficulty // Add 'difficulty' field first
  );
}
```

## API Endpoints

### GET `/api/exercises`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `category` | string | Filter by category |
| `muscleGroup` | string | Filter by muscle group |
| `mechanics` | string | Filter by mechanics |
| `pattern` | string | Filter by movement pattern |
| `filters` | boolean | Return filter options |
| `stats` | boolean | Return statistics |

**Response:**
```json
{
  "exercises": [...],
  "count": 42,
  "filters": {
    "query": "squat",
    "category": "lower",
    "muscleGroup": null,
    "mechanics": null,
    "pattern": null
  }
}
```

## Pages

- `/` - Homepage with overview
- `/exercises` - Browse all exercises
- `/exercises/search` - Interactive search with filters

## Tips & Best Practices

1. **Use Server Components When Possible** - Faster initial load
2. **Debounce Search Inputs** - Reduce API calls (300ms delay)
3. **Cache Filter Options** - Load once, reuse everywhere
4. **Type Safety** - Import the `Exercise` interface for type checking
5. **Case Insensitive Search** - All searches are lowercased for better UX

## Future Enhancements

Potential improvements:
- [ ] Add pagination for large result sets
- [ ] Implement sorting (by name, difficulty, etc.)
- [ ] Add favorites/bookmarks
- [ ] Export filtered results as CSV/JSON
- [ ] Add exercise details page with images/videos
- [ ] Implement workout routine builder
- [ ] Add exercise history tracking
- [ ] Cache API responses with SWR or React Query

## Troubleshooting

**Issue: "Cannot find module '@/lib/exerciseDb'"**
- Ensure `tsconfig.json` has path alias configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue: API returns empty results**
- Check filter values match exactly (case-insensitive but spelling matters)
- Verify the JSON file is properly loaded

**Issue: TypeScript errors**
- Make sure all imports use the correct path aliases
- Check that the `Exercise` interface matches your JSON structure

## License

This database implementation is part of the WWWorkout project.