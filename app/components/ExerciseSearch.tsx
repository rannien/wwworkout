'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Exercise } from '@/lib/exerciseDb';
import {
  EMPTY_EXERCISE_FILTERS,
  MAX_QUERY_LENGTH,
  exerciseFiltersToSearchParams,
  hasActiveExerciseFilters,
  matchesExerciseFilters,
  parseExerciseFilters,
  type ExerciseFilterOptions,
  type ExerciseFilters,
} from '@/lib/exerciseFilters';
import {
  DEFAULT_EXERCISE_LIST_VIEW,
  exerciseListViewToSearchParams,
  parseExerciseGrouping,
  parseExerciseListView,
  sortExercises,
  type ExerciseGrouping,
  type ExerciseLayout,
  type ExerciseListView,
} from '@/lib/exerciseList';
import ExerciseResults from '@/app/components/ExerciseResults';

const URL_SYNC_DELAY_MS = 300;

const LAYOUT_OPTIONS: { value: ExerciseLayout; label: string }[] = [
  { value: 'cards', label: 'Cards' },
  { value: 'table', label: 'Table' },
];

const GROUPING_OPTIONS: { value: ExerciseGrouping; label: string }[] = [
  { value: 'none', label: 'No grouping' },
  { value: 'movementPattern', label: 'Movement pattern' },
  { value: 'muscleGroup', label: 'Muscle group' },
];

interface ExerciseSearchProps {
  exercises: Exercise[];
  filterOptions: ExerciseFilterOptions;
}

interface SelectOption {
  value: string;
  label: string;
}

interface GlassSelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

function GlassSelect({ id, label, options, value, onChange }: GlassSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="glass-strong w-full appearance-none rounded-2xl py-3 pr-10 pl-4 capitalize text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-zinc-50 [&>option]:bg-white dark:[&>option]:bg-zinc-900"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 fill-none stroke-zinc-600 stroke-2 dark:stroke-zinc-300"
        >
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function filterSelectOptions(allLabel: string, values: string[]): SelectOption[] {
  return [{ value: '', label: allLabel }, ...values.map((value) => ({ value, label: value }))];
}

interface ExerciseListState {
  filters: ExerciseFilters;
  view: ExerciseListView;
}

function listStateFromSearch(
  search: string,
  options: ExerciseFilterOptions,
  fallbackView: ExerciseListView,
): ExerciseListState {
  const params = new URLSearchParams(search);
  return { filters: parseExerciseFilters(params, options), view: parseExerciseListView(params, fallbackView) };
}

function listStateToSearch({ filters, view }: ExerciseListState): string {
  return exerciseListViewToSearchParams(view, exerciseFiltersToSearchParams(filters)).toString();
}

// Links to /exercises (badges, nav, matrix) set the filters but keep the current view unless they name one.
function useUrlSyncedListState(options: ExerciseFilterOptions) {
  const urlSearch = useSearchParams().toString();
  const [state, setState] = useState(() => listStateFromSearch(urlSearch, options, DEFAULT_EXERCISE_LIST_VIEW));
  const [seenUrlSearch, setSeenUrlSearch] = useState(urlSearch);
  const [writtenUrlSearch, setWrittenUrlSearch] = useState(urlSearch);

  if (urlSearch !== seenUrlSearch) {
    setSeenUrlSearch(urlSearch);
    if (urlSearch !== writtenUrlSearch) {
      setState(listStateFromSearch(urlSearch, options, state.view));
    }
  }

  const stateSearch = listStateToSearch(state);

  useEffect(() => {
    if (stateSearch === writtenUrlSearch) return;
    const timer = setTimeout(() => {
      setWrittenUrlSearch(stateSearch);
      window.history.replaceState(null, '', stateSearch ? `?${stateSearch}` : window.location.pathname);
    }, URL_SYNC_DELAY_MS);
    return () => clearTimeout(timer);
  }, [stateSearch, writtenUrlSearch]);

  return [state, setState] as const;
}

export default function ExerciseSearch({ exercises, filterOptions }: ExerciseSearchProps) {
  const [{ filters, view }, setState] = useUrlSyncedListState(filterOptions);
  const results = sortExercises(
    exercises.filter((exercise) => matchesExerciseFilters(exercise, filters)),
    view.sortBy,
  );
  const hasActiveFilters = hasActiveExerciseFilters(filters);

  const updateFilter = (name: keyof ExerciseFilters, value: string) => {
    setState((current) => ({ ...current, filters: { ...current.filters, [name]: value } }));
  };

  const updateView = (change: Partial<ExerciseListView>) => {
    setState((current) => ({ ...current, view: { ...current.view, ...change } }));
  };

  const clearFilters = () => setState((current) => ({ ...current, filters: EMPTY_EXERCISE_FILTERS }));

  return (
    <div className="w-full">
      <search className="glass mb-6 block rounded-3xl p-5 sm:p-6">
        <div className="mb-4">
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search by name, muscle group, or movement pattern
          </label>
          <input
            id="search"
            type="search"
            value={filters.query}
            maxLength={MAX_QUERY_LENGTH}
            onChange={(event) => updateFilter('query', event.target.value)}
            placeholder="e.g. deadlift, biceps, squat…"
            className="glass-strong w-full appearance-none rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-zinc-50 dark:placeholder:text-zinc-400"
          />
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassSelect
            id="category"
            label="Category"
            options={filterSelectOptions('All categories', filterOptions.categories)}
            value={filters.category}
            onChange={(value) => updateFilter('category', value)}
          />
          <GlassSelect
            id="muscleGroup"
            label="Muscle group"
            options={filterSelectOptions('All muscle groups', filterOptions.muscleGroups)}
            value={filters.muscleGroup}
            onChange={(value) => updateFilter('muscleGroup', value)}
          />
          <GlassSelect
            id="movementPattern"
            label="Movement pattern"
            options={filterSelectOptions('All patterns', filterOptions.movementPatterns)}
            value={filters.movementPattern}
            onChange={(value) => updateFilter('movementPattern', value)}
          />
          <GlassSelect
            id="mechanics"
            label="Mechanics"
            options={filterSelectOptions('All types', filterOptions.mechanics)}
            value={filters.mechanics}
            onChange={(value) => updateFilter('mechanics', value)}
          />
        </div>

        <div className="flex min-h-10 items-center justify-between gap-4">
          <output className="text-sm text-zinc-700 dark:text-zinc-300">
            {results.length} exercise{results.length !== 1 ? 's' : ''}
          </output>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-sky-300 dark:hover:bg-white/10"
            >
              Clear all filters
            </button>
          )}
        </div>
      </search>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <fieldset className="glass inline-flex rounded-full p-1">
          <legend className="sr-only">Layout</legend>
          {LAYOUT_OPTIONS.map((option) => {
            const active = view.layout === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => updateView({ layout: option.value })}
                className={`min-h-10 rounded-full px-5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-sky-600 ${
                  active
                    ? 'glass-strong text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-700 hover:bg-white/50 dark:text-zinc-300 dark:hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </fieldset>
        <div className="w-full sm:w-60">
          <GlassSelect
            id="groupBy"
            label="Group by"
            options={GROUPING_OPTIONS}
            value={view.groupBy}
            onChange={(value) => updateView({ groupBy: parseExerciseGrouping(value, view.groupBy) })}
          />
        </div>
      </div>

      {results.length > 0 ? (
        <ExerciseResults exercises={results} view={view} onSort={(sortBy) => updateView({ sortBy })} />
      ) : (
        <div className="glass rounded-3xl px-6 py-12 text-center">
          <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">No exercises found</p>
          <p className="mb-6 text-sm text-zinc-700 dark:text-zinc-300">Try adjusting your filters or search query.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full bg-sky-700 px-6 py-2.5 font-medium text-white shadow-lg shadow-sky-700/30 transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
