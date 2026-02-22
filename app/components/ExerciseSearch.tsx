'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Exercise {
  id: string;
  name: string;
  category: string[];
  movement_pattern: string;
  mechanics: string;
  muscle_groups: string[];
}

interface FilterOptions {
  categories: string[];
  muscleGroups: string[];
  mechanics: string[];
  movementPatterns: string[];
}

export default function ExerciseSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedMechanics, setSelectedMechanics] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  // Load filter options on mount
  useEffect(() => {
    fetch('/api/exercises?filters=true')
      .then(res => res.json())
      .then(data => setFilterOptions(data))
      .catch(err => console.error('Failed to load filters:', err));
  }, []);

  // Debounced search
  const searchExercises = useCallback(() => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedMuscleGroup) params.append('muscleGroup', selectedMuscleGroup);
    if (selectedMechanics) params.append('mechanics', selectedMechanics);

    fetch(`/api/exercises?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setExercises(data.exercises);
        setResultsCount(data.count);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search failed:', err);
        setLoading(false);
      });
  }, [query, selectedCategory, selectedMuscleGroup, selectedMechanics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchExercises]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedMuscleGroup('');
    setSelectedMechanics('');
  };

  const hasActiveFilters = query || selectedCategory || selectedMuscleGroup || selectedMechanics;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
          Search Exercises
        </h2>

        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Search by name, muscle group, or movement pattern
          </label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., deadlift, biceps, squat..."
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-50 transition"
          />
        </div>

        {/* Filters */}
        {filterOptions && (
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-50 capitalize"
              >
                <option value="">All Categories</option>
                {filterOptions.categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Muscle Group Filter */}
            <div>
              <label htmlFor="muscleGroup" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Muscle Group
              </label>
              <select
                id="muscleGroup"
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-50 capitalize"
              >
                <option value="">All Muscle Groups</option>
                {filterOptions.muscleGroups.map(mg => (
                  <option key={mg} value={mg} className="capitalize">
                    {mg}
                  </option>
                ))}
              </select>
            </div>

            {/* Mechanics Filter */}
            <div>
              <label htmlFor="mechanics" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Mechanics
              </label>
              <select
                id="mechanics"
                value={selectedMechanics}
                onChange={(e) => setSelectedMechanics(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-50 capitalize"
              >
                <option value="">All Types</option>
                {filterOptions.mechanics.map(mech => (
                  <option key={mech} value={mech} className="capitalize">
                    {mech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Found {resultsCount} exercise{resultsCount !== 1 ? 's' : ''}
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading exercises...</p>
        </div>
      )}

      {/* Results */}
      {!loading && exercises.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map(exercise => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <h3 className="font-bold text-lg mb-3 text-zinc-900 dark:text-zinc-50">
                {exercise.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Type: </span>
                  <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                    {exercise.mechanics}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Pattern: </span>
                  <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                    {exercise.movement_pattern}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Category: </span>
                  <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                    {exercise.category.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Muscles: </span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {exercise.muscle_groups.map(muscle => (
                      <span 
                        key={muscle}
                        className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs capitalize"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && hasActiveFilters && exercises.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
            No exercises found
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasActiveFilters && (
        <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Start searching or apply filters to find exercises
          </p>
        </div>
      )}
    </div>
  );
}