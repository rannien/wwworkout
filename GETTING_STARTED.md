# Getting Started with Your Exercise Database

Welcome! This guide will get you up and running with your new exercise database system in just a few minutes.

---

## 🚀 Quick Start (3 Steps)

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open Your Browser

Visit: **http://localhost:3000**

### 3. Explore the Pages

- **Homepage** (`/`) - Overview and statistics
- **Browse** (`/exercises`) - View all exercises
- **Search** (`/exercises/search`) - Interactive search

That's it! Your database is now running. 🎉

---

## 📖 Your First Query

### Option A: In a Server Component

Create a new file: `app/my-page/page.tsx`

```tsx
import { getAllExercises } from '@/lib/exerciseDb';

export default function MyPage() {
  const exercises = getAllExercises();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        My Exercise Database
      </h1>
      <p className="text-lg mb-6">
        Total exercises: {exercises.length}
      </p>
      <div className="grid gap-4">
        {exercises.slice(0, 10).map(ex => (
          <div key={ex.id} className="p-4 border rounded">
            <h3 className="font-bold">{ex.name}</h3>
            <p className="text-sm text-gray-600">
              {ex.muscle_groups.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Visit: http://localhost:3000/my-page

### Option B: Using the API

Create a new file: `app/components/MySearch.tsx`

```tsx
'use client';

import { useState } from 'react';

export default function MySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/exercises?q=${query}`);
    const data = await response.json();
    setResults(data.exercises);
  };

  return (
    <div className="p-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={handleSearch}
        placeholder="Search exercises..."
        className="w-full p-3 border rounded"
      />
      <div className="mt-4">
        {results.map((ex: any) => (
          <div key={ex.id} className="p-3 border-b">
            {ex.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 Common Tasks

### Task 1: Find Lower Body Exercises

```tsx
import { filterByCategory } from '@/lib/exerciseDb';

const lowerBody = filterByCategory('lower');
console.log(lowerBody.length); // e.g., 45 exercises
```

### Task 2: Find Chest Exercises

```tsx
import { filterByMuscleGroup } from '@/lib/exerciseDb';

const chestExercises = filterByMuscleGroup('chest');
```

### Task 3: Find Compound Exercises

```tsx
import { filterByMechanics } from '@/lib/exerciseDb';

const compound = filterByMechanics('compound');
```

### Task 4: Search for Squats

```tsx
import { searchExercises } from '@/lib/exerciseDb';

const squatVariations = searchExercises('squat');
```

### Task 5: Advanced Filtering

```tsx
import { filterExercises } from '@/lib/exerciseDb';

const legDay = filterExercises({
  category: 'lower',
  mechanics: 'compound',
  muscleGroup: 'glutes'
});
```

### Task 6: Get Statistics

```tsx
import { getExerciseStats } from '@/lib/exerciseDb';

const stats = getExerciseStats();
console.log(stats.total); // Total number of exercises
console.log(stats.byCategory); // Breakdown by category
```

---

## 🌐 Using the API

### Get All Exercises

```bash
curl http://localhost:3000/api/exercises
```

### Search

```bash
curl http://localhost:3000/api/exercises?q=deadlift
```

### Filter by Category

```bash
curl http://localhost:3000/api/exercises?category=lower
```

### Filter by Muscle Group

```bash
curl http://localhost:3000/api/exercises?muscleGroup=chest
```

### Multiple Filters

```bash
curl http://localhost:3000/api/exercises?category=lower&mechanics=compound
```

### Get Filter Options

```bash
curl http://localhost:3000/api/exercises?filters=true
```

### Get Statistics

```bash
curl http://localhost:3000/api/exercises?stats=true
```

---

## 📚 Available Functions

Import these from `@/lib/exerciseDb`:

| Function | Use Case | Example |
|----------|----------|---------|
| `getAllExercises()` | Get everything | `const all = getAllExercises()` |
| `getExerciseById(id)` | Get one exercise | `const ex = getExerciseById('1')` |
| `searchExercises(query)` | Search | `const results = searchExercises('squat')` |
| `filterByCategory(cat)` | Filter by category | `const lower = filterByCategory('lower')` |
| `filterByMuscleGroup(mg)` | Filter by muscle | `const chest = filterByMuscleGroup('chest')` |
| `filterByMechanics(mech)` | Filter by type | `const compound = filterByMechanics('compound')` |
| `filterByMovementPattern(pat)` | Filter by pattern | `const push = filterByMovementPattern('push')` |
| `filterExercises(filters)` | Multi-filter | `const ex = filterExercises({ ... })` |
| `getUniqueCategories()` | Get categories | `const cats = getUniqueCategories()` |
| `getUniqueMuscleGroups()` | Get muscle groups | `const muscles = getUniqueMuscleGroups()` |
| `getExerciseStats()` | Get stats | `const stats = getExerciseStats()` |

---

## 🎨 Building Your First Feature

Let's build a simple workout planner:

### 1. Create the Page

File: `app/workout/page.tsx`

```tsx
import { filterExercises } from '@/lib/exerciseDb';

export default function WorkoutPage() {
  // Build a Push-Pull-Legs split
  const pushDay = filterExercises({
    category: 'upper',
    movementPattern: 'push'
  }).slice(0, 5);

  const pullDay = filterExercises({
    category: 'upper',
    movementPattern: 'pull'
  }).slice(0, 5);

  const legDay = filterExercises({
    category: 'lower'
  }).slice(0, 5);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        My PPL Workout
      </h1>

      {/* Push Day */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Push Day</h2>
        <div className="space-y-3">
          {pushDay.map((ex, index) => (
            <div key={ex.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">
                    {index + 1}. {ex.name}
                  </span>
                  <p className="text-sm text-gray-600">
                    {ex.muscle_groups.join(', ')}
                  </p>
                </div>
                <span className="text-gray-500">3 × 8-12</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull Day */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pull Day</h2>
        <div className="space-y-3">
          {pullDay.map((ex, index) => (
            <div key={ex.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">
                    {index + 1}. {ex.name}
                  </span>
                  <p className="text-sm text-gray-600">
                    {ex.muscle_groups.join(', ')}
                  </p>
                </div>
                <span className="text-gray-500">3 × 8-12</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leg Day */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Leg Day</h2>
        <div className="space-y-3">
          {legDay.map((ex, index) => (
            <div key={ex.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">
                    {index + 1}. {ex.name}
                  </span>
                  <p className="text-sm text-gray-600">
                    {ex.muscle_groups.join(', ')}
                  </p>
                </div>
                <span className="text-gray-500">3 × 8-12</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### 2. Visit Your New Page

Navigate to: http://localhost:3000/workout

You now have a working workout planner! 💪

---

## 🔍 Understanding the Data Structure

Each exercise has these fields:

```typescript
{
  id: "1",                              // Unique identifier
  name: "Deadlift",                     // Exercise name
  category: ["lower"],                  // Body part(s)
  movement_pattern: "bend",             // Type of movement
  mechanics: "compound",                // Compound or isolation
  muscle_groups: ["hamstrings", "glutes", "lower back"],
  created_at: "1675529768665",
  updated_at: "1675529768665",
  created_by_id: null,
  updated_by_id: null
}
```

---

## 💡 Tips & Tricks

### Tip 1: Case-Insensitive Searches
All searches automatically ignore case:
```tsx
searchExercises('SQUAT') === searchExercises('squat')
```

### Tip 2: Partial Matches
Search finds partial matches:
```tsx
searchExercises('press') // Finds "Bench Press", "Shoulder Press", etc.
```

### Tip 3: Check Available Options
Before filtering, see what's available:
```tsx
const categories = getUniqueCategories();
console.log(categories); // ['lower', 'upper', 'core']
```

### Tip 4: Chain Operations
Combine multiple filters:
```tsx
const exercises = getAllExercises()
  .filter(ex => ex.category.includes('upper'))
  .filter(ex => ex.mechanics === 'compound')
  .slice(0, 5); // Take first 5
```

### Tip 5: Use TypeScript
Import the type for autocomplete:
```tsx
import { type Exercise } from '@/lib/exerciseDb';

const myExercise: Exercise = getExerciseById('1')!;
```

---

## 🐛 Troubleshooting

### Problem: Import errors

**Solution**: Make sure you're using the `@/` alias:
```tsx
import { getAllExercises } from '@/lib/exerciseDb'; // ✅ Correct
import { getAllExercises } from '../lib/exerciseDb'; // ❌ Avoid
```

### Problem: No results found

**Solution**: Check the available values:
```tsx
const categories = getUniqueCategories();
console.log(categories); // See what's actually in the database
```

### Problem: TypeScript errors

**Solution**: Make sure `tsconfig.json` has the path alias configured (it already does!)

### Problem: Page not found

**Solution**: Make sure you created the file in the right place:
- Server pages: `app/your-page/page.tsx`
- Client components: `app/components/YourComponent.tsx`

---

## 📖 Next Steps

### Level 1: Explore
- ✅ Browse the existing pages
- ✅ Try the search interface
- ✅ Experiment with API endpoints

### Level 2: Customize
- Create your own workout page
- Add custom filtering logic
- Build a favorite exercises list

### Level 3: Extend
- Add pagination
- Implement sorting
- Create exercise detail pages
- Build a workout routine builder

---

## 📚 More Resources

- **Quick Reference**: `QUICK_REFERENCE.md` - One-page cheat sheet
- **Full Guide**: `EXERCISE_DATABASE_GUIDE.md` - Comprehensive guide
- **Code Examples**: `lib/examples.tsx` - 13 practical examples
- **Technical Docs**: `lib/README.md` - In-depth documentation
- **Architecture**: `ARCHITECTURE.md` - System design
- **Summary**: `IMPLEMENTATION_SUMMARY.md` - What was built

---

## 🎓 Learning Path

### Week 1: Basics
- [ ] Complete this getting started guide
- [ ] Create your first page
- [ ] Try all the query functions
- [ ] Use the API endpoints

### Week 2: Build Features
- [ ] Create a workout planner
- [ ] Build a muscle group selector
- [ ] Add a favorites system
- [ ] Implement sorting/filtering UI

### Week 3: Advanced
- [ ] Add pagination
- [ ] Create exercise detail pages
- [ ] Build a workout routine builder
- [ ] Add progress tracking

---

## 🎉 You're Ready!

You now know how to:
- ✅ Start the development server
- ✅ Query the exercise database
- ✅ Use server and client components
- ✅ Call API endpoints
- ✅ Build custom features

**Start building your fitness app!** 💪

---

## 🤝 Need Help?

1. Check `QUICK_REFERENCE.md` for quick lookups
2. Read `EXERCISE_DATABASE_GUIDE.md` for detailed explanations
3. Look at `lib/examples.tsx` for code examples
4. Review the existing pages in `app/`

Happy coding! 🚀