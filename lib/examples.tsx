// Example Usage of Exercise Database
// This file demonstrates various ways to use the exercise database in your components

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
  getExerciseStats,
} from './exerciseDb';

// ============================================================================
// EXAMPLE 1: Get All Exercises
// ============================================================================

export function ExampleGetAll() {
  const exercises = getAllExercises();

  return (
    <div>
      <h2>All Exercises ({exercises.length})</h2>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>{ex.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Get Single Exercise by ID
// ============================================================================

export function ExampleGetById({ exerciseId }: { exerciseId: string }) {
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  return (
    <div>
      <h2>{exercise.name}</h2>
      <p>Category: {exercise.category.join(', ')}</p>
      <p>Mechanics: {exercise.mechanics}</p>
      <p>Pattern: {exercise.movement_pattern}</p>
      <p>Muscles: {exercise.muscle_groups.join(', ')}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Search Exercises
// ============================================================================

export function ExampleSearch() {
  const results = searchExercises('squat');

  return (
    <div>
      <h2>Search Results for &quot;squat&quot;</h2>
      {results.map((ex) => (
        <div key={ex.id}>{ex.name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Filter by Category
// ============================================================================

export function ExampleFilterByCategory() {
  const lowerBodyExercises = filterByCategory('lower');
  const upperBodyExercises = filterByCategory('upper');

  return (
    <div>
      <section>
        <h3>Lower Body ({lowerBodyExercises.length})</h3>
        {lowerBodyExercises.map((ex) => (
          <div key={ex.id}>{ex.name}</div>
        ))}
      </section>

      <section>
        <h3>Upper Body ({upperBodyExercises.length})</h3>
        {upperBodyExercises.map((ex) => (
          <div key={ex.id}>{ex.name}</div>
        ))}
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Filter by Muscle Group
// ============================================================================

export function ExampleFilterByMuscleGroup() {
  const chestExercises = filterByMuscleGroup('chest');
  const bicepsExercises = filterByMuscleGroup('biceps');

  return (
    <div>
      <h3>Chest Exercises ({chestExercises.length})</h3>
      {chestExercises.map((ex) => (
        <div key={ex.id}>
          {ex.name} - {ex.mechanics}
        </div>
      ))}

      <h3>Biceps Exercises ({bicepsExercises.length})</h3>
      {bicepsExercises.map((ex) => (
        <div key={ex.id}>
          {ex.name} - {ex.movement_pattern}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Filter by Mechanics (Compound vs Isolation)
// ============================================================================

export function ExampleFilterByMechanics() {
  const compoundExercises = filterByMechanics('compound');
  const isolationExercises = filterByMechanics('isolation');

  return (
    <div>
      <section>
        <h3>Compound Exercises ({compoundExercises.length})</h3>
        <p>Great for building overall strength and mass</p>
        {compoundExercises.slice(0, 5).map((ex) => (
          <div key={ex.id}>
            {ex.name} - targets: {ex.muscle_groups.join(', ')}
          </div>
        ))}
      </section>

      <section>
        <h3>Isolation Exercises ({isolationExercises.length})</h3>
        <p>Perfect for targeting specific muscles</p>
        {isolationExercises.slice(0, 5).map((ex) => (
          <div key={ex.id}>
            {ex.name} - targets: {ex.muscle_groups.join(', ')}
          </div>
        ))}
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Filter by Movement Pattern
// ============================================================================

export function ExampleFilterByMovementPattern() {
  const squatPatterns = filterByMovementPattern('squat');
  const pushPatterns = filterByMovementPattern('push');
  const pullPatterns = filterByMovementPattern('pull');

  return (
    <div>
      <h3>Squat Pattern ({squatPatterns.length})</h3>
      {squatPatterns.map((ex) => (
        <div key={ex.id}>{ex.name}</div>
      ))}

      <h3>Push Pattern ({pushPatterns.length})</h3>
      {pushPatterns.map((ex) => (
        <div key={ex.id}>{ex.name}</div>
      ))}

      <h3>Pull Pattern ({pullPatterns.length})</h3>
      {pullPatterns.map((ex) => (
        <div key={ex.id}>{ex.name}</div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Advanced Multi-Filter
// ============================================================================

export function ExampleAdvancedFilter() {
  // Find compound lower body exercises targeting glutes
  const legDayExercises = filterExercises({
    category: 'lower',
    mechanics: 'compound',
    muscleGroup: 'glutes',
  });

  // Find upper body pull exercises
  const backDay = filterExercises({
    category: 'upper',
    movementPattern: 'pull',
  });

  return (
    <div>
      <section>
        <h3>Leg Day Exercises</h3>
        <p>Compound lower body exercises targeting glutes</p>
        {legDayExercises.map((ex) => (
          <div key={ex.id}>
            {ex.name} - {ex.muscle_groups.join(', ')}
          </div>
        ))}
      </section>

      <section>
        <h3>Back Day Exercises</h3>
        <p>Upper body pulling movements</p>
        {backDay.map((ex) => (
          <div key={ex.id}>
            {ex.name} - {ex.muscle_groups.join(', ')}
          </div>
        ))}
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Get Filter Options (for dropdowns)
// ============================================================================

export function ExampleFilterOptions() {
  const categories = getUniqueCategories();
  const muscleGroups = getUniqueMuscleGroups();

  return (
    <div>
      <h3>Available Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat}>{cat}</li>
        ))}
      </ul>

      <h3>Available Muscle Groups</h3>
      <ul>
        {muscleGroups.map((mg) => (
          <li key={mg}>{mg}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Get Database Statistics
// ============================================================================

export function ExampleStats() {
  const stats = getExerciseStats();

  return (
    <div>
      <h2>Exercise Database Statistics</h2>
      <p>Total Exercises: {stats.total}</p>

      <h3>By Category</h3>
      {stats.byCategory.map((item) => (
        <div key={item.category}>
          {item.category}: {item.count} exercises
        </div>
      ))}

      <h3>By Mechanics</h3>
      {stats.byMechanics.map((item) => (
        <div key={item.mechanics}>
          {item.mechanics}: {item.count} exercises
        </div>
      ))}

      <h3>By Movement Pattern</h3>
      {stats.byMovementPattern.map((item) => (
        <div key={item.pattern}>
          {item.pattern}: {item.count} exercises
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 11: Build a Workout Routine
// ============================================================================

export function ExampleWorkoutBuilder() {
  // PPL Split Example (Push, Pull, Legs)

  const pushDay = filterExercises({
    category: 'upper',
    movementPattern: 'push',
  }).slice(0, 5);

  const pullDay = filterExercises({
    category: 'upper',
    movementPattern: 'pull',
  }).slice(0, 5);

  const legDay = filterExercises({
    category: 'lower',
  }).slice(0, 5);

  return (
    <div>
      <h2>PPL Workout Split</h2>

      <section>
        <h3>Push Day</h3>
        <ol>
          {pushDay.map((ex) => (
            <li key={ex.id}>
              {ex.name} - 3x8-12 reps
              <br />
              <small>Targets: {ex.muscle_groups.join(', ')}</small>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Pull Day</h3>
        <ol>
          {pullDay.map((ex) => (
            <li key={ex.id}>
              {ex.name} - 3x8-12 reps
              <br />
              <small>Targets: {ex.muscle_groups.join(', ')}</small>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Leg Day</h3>
        <ol>
          {legDay.map((ex) => (
            <li key={ex.id}>
              {ex.name} - 3x8-12 reps
              <br />
              <small>Targets: {ex.muscle_groups.join(', ')}</small>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 12: Exercise Substitutions
// ============================================================================

export function ExampleExerciseSubstitutions({ exerciseId }: { exerciseId: string }) {
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  // Find similar exercises based on same muscle groups and movement pattern
  const substitutions = getAllExercises().filter(
    (ex) =>
      ex.id !== exercise.id &&
      ex.movement_pattern === exercise.movement_pattern &&
      ex.muscle_groups.some((mg) => exercise.muscle_groups.includes(mg)),
  );

  return (
    <div>
      <h3>Current Exercise: {exercise.name}</h3>
      <p>Muscles: {exercise.muscle_groups.join(', ')}</p>
      <p>Pattern: {exercise.movement_pattern}</p>

      <h4>Similar Exercises You Can Try:</h4>
      {substitutions.length > 0 ? (
        <ul>
          {substitutions.map((sub) => (
            <li key={sub.id}>
              {sub.name} ({sub.mechanics})
              <br />
              <small>Targets: {sub.muscle_groups.join(', ')}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No similar exercises found</p>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 13: Client-Side Dynamic Search
// Note: To use this component, create a separate file with 'use client' at the top
// ============================================================================

// Example for a separate client component file:
// 'use client';
// import { useState } from 'react';
// import { searchExercises } from '@/lib/exerciseDb';

/*
export function ExampleDynamicSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setResults(searchExercises(searchQuery));
    } else {
      setResults([]);
    }
  };
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search exercises..."
        className="border rounded px-4 py-2 w-full"
      />
      
      {results.length > 0 && (
        <div className="mt-4">
          <p>{results.length} results found</p>
          <ul>
            {results.map(ex => (
              <li key={ex.id} className="py-2">
                <strong>{ex.name}</strong>
                <br />
                <small>{ex.muscle_groups.join(', ')}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
*/
