# Quick Reference - Exercise Database

## 🚀 Getting Started

```bash
npm run dev
# Visit http://localhost:3000
```

## 📍 Pages

- `/` - Homepage
- `/exercises` - Browse all
- `/exercises/search` - Search interface

## 🔧 Import Functions

```typescript
import {
  getAllExercises,
  getExerciseById,
  searchExercises,
  filterByCategory,
  filterByMuscleGroup,
  filterByMechanics,
  filterByMovementPattern,
  filterExercises,
  getUniqueCategories,
  getUniqueMuscleGroups,
  getExerciseStats
} from '@/lib/exerciseDb';
```

## 💻 Common Operations

### Get All Exercises
```typescript
const exercises = getAllExercises();
// Returns: Exercise[]
```

### Get One Exercise
```typescript
const exercise = getExerciseById('1');
// Returns: Exercise | undefined
```

### Search
```typescript
const results = searchExercises('squat');
// Searches: name, muscle groups, movement pattern
```

### Filter by Category
```typescript
const lower = filterByCategory('lower');
const upper = filterByCategory('upper');
```

### Filter by Muscle Group
```typescript
const chest = filterByMuscleGroup('chest');
const biceps = filterByMuscleGroup('biceps');
```

### Filter by Mechanics
```typescript
const compound = filterByMechanics('compound');
const isolation = filterByMechanics('isolation');
```

### Filter by Movement Pattern
```typescript
const push = filterByMovementPattern('push');
const pull = filterByMovementPattern('pull');
const squat = filterByMovementPattern('squat');
```

### Advanced Multi-Filter
```typescript
const legDay = filterExercises({
  category: 'lower',
  mechanics: 'compound',
  muscleGroup: 'glutes'
});

const backDay = filterExercises({
  category: 'upper',
  movementPattern: 'pull'
});
```

### Get Filter Options
```typescript
const categories = getUniqueCategories();
// Returns: ['lower', 'upper', ...]

const muscles = getUniqueMuscleGroups();
// Returns: ['chest', 'biceps', ...]
```

### Get Statistics
```typescript
const stats = getExerciseStats();
// Returns: { total, byCategory, byMechanics, byMovementPattern }
```

## 🌐 API Endpoints

### Search
```
GET /api/exercises?q=squat
```

### Filter by Category
```
GET /api/exercises?category=lower
```

### Filter by Muscle Group
```
GET /api/exercises?muscleGroup=chest
```

### Filter by Mechanics
```
GET /api/exercises?mechanics=compound
```

### Multiple Filters
```
GET /api/exercises?category=lower&mechanics=compound&muscleGroup=glutes
```

### Get Filter Options
```
GET /api/exercises?filters=true
```

### Get Statistics
```
GET /api/exercises?stats=true
```

## 📦 Response Format

```json
{
  "exercises": [
    {
      "id": "1",
      "name": "Deadlift",
      "category": ["lower"],
      "movement_pattern": "bend",
      "mechanics": "compound",
      "muscle_groups": ["hamstrings", "glutes", "lower back"]
    }
  ],
  "count": 1,
  "filters": {
    "query": null,
    "category": "lower",
    "muscleGroup": null,
    "mechanics": "compound",
    "pattern": null
  }
}
```

## 🎯 Server Component Example

```tsx
import { getAllExercises } from '@/lib/exerciseDb';

export default function MyPage() {
  const exercises = getAllExercises();
  
  return (
    <div>
      {exercises.map(ex => (
        <div key={ex.id}>{ex.name}</div>
      ))}
    </div>
  );
}
```

## 🎨 Client Component Example

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function MySearch() {
  const [exercises, setExercises] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query) {
      fetch(`/api/exercises?q=${query}`)
        .then(res => res.json())
        .then(data => setExercises(data.exercises));
    }
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

## 📊 Data Structure

```typescript
interface Exercise {
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
```

## 💡 Quick Tips

- ✅ Use server components for static data
- ✅ Use API routes for dynamic filtering
- ✅ Searches are case-insensitive
- ✅ Data is cached in memory
- ✅ All functions return arrays (or single object)
- ✅ Filters can be combined

## 🎯 Common Patterns

### Build PPL Split
```typescript
const pushDay = filterExercises({
  category: 'upper',
  movementPattern: 'push'
});

const pullDay = filterExercises({
  category: 'upper',
  movementPattern: 'pull'
});

const legDay = filterByCategory('lower');
```

### Find Alternatives
```typescript
const exercise = getExerciseById('1');
const similar = getAllExercises().filter(ex => 
  ex.movement_pattern === exercise.movement_pattern
);
```

### Create Dropdown Filters
```typescript
const categories = getUniqueCategories();

<select>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

## 📁 File Locations

- **Database Logic**: `lib/exerciseDb.ts`
- **API Route**: `app/api/exercises/route.ts`
- **Search Component**: `app/components/ExerciseSearch.tsx`
- **Browse Page**: `app/exercises/page.tsx`
- **Search Page**: `app/exercises/search/page.tsx`
- **Examples**: `lib/examples.tsx`
- **Full Docs**: `lib/README.md`

## 🔍 Available Filters

**Categories**: lower, upper, core, etc.
**Muscle Groups**: chest, biceps, triceps, quadriceps, hamstrings, etc.
**Mechanics**: compound, isolation
**Movement Patterns**: push, pull, squat, bend, etc.

Use `getUniqueCategories()` and `getUniqueMuscleGroups()` to see all options!