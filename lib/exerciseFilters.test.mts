import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_EXERCISE_FILTERS,
  MAX_QUERY_LENGTH,
  exerciseFiltersToSearchParams,
  exerciseListHref,
  hasActiveExerciseFilters,
  matchesExerciseFilters,
  parseExerciseFilters,
  type ExerciseFilterOptions,
  type FilterableExercise,
} from './exerciseFilters.ts';

const deadlift: FilterableExercise = {
  name: 'Romanian Deadlift',
  category: ['strength', 'powerlifting'],
  movement_pattern: 'Hinge',
  mechanics: 'Compound',
  muscle_groups: ['Hamstrings', 'Lower Back'],
};

const options: ExerciseFilterOptions = {
  categories: ['strength', 'cardio'],
  muscleGroups: ['biceps', 'lower back'],
  mechanics: ['compound', 'isolation'],
  movementPatterns: ['pull', 'bend'],
};

describe('matchesExerciseFilters', () => {
  it('matches everything when criteria are empty', () => {
    assert.equal(matchesExerciseFilters(deadlift, {}), true);
  });

  it('matches the query against the name case-insensitively', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: 'ROMANIAN' }), true);
  });

  it('matches the query as a substring of a muscle group', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: 'hamstr' }), true);
  });

  it('matches the query against the movement pattern', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: 'hinge' }), true);
  });

  it('rejects an exercise when the query matches no field', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: 'curl' }), false);
  });

  it('trims the query before matching', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: '  deadlift  ' }), true);
  });

  it('treats a whitespace-only query as no filter', () => {
    assert.equal(matchesExerciseFilters(deadlift, { query: '   ' }), true);
  });

  it('matches a category that the exercise belongs to, case-insensitively', () => {
    assert.equal(matchesExerciseFilters(deadlift, { category: 'Powerlifting' }), true);
  });

  it('rejects a category the exercise does not belong to', () => {
    assert.equal(matchesExerciseFilters(deadlift, { category: 'cardio' }), false);
  });

  it('matches a muscle group by case-insensitive equality', () => {
    assert.equal(matchesExerciseFilters(deadlift, { muscleGroup: 'lower back' }), true);
  });

  it('does not match a muscle group that is only a substring of one', () => {
    assert.equal(matchesExerciseFilters(deadlift, { muscleGroup: 'back' }), false);
  });

  it('matches mechanics case-insensitively', () => {
    assert.equal(matchesExerciseFilters(deadlift, { mechanics: 'compound' }), true);
  });

  it('rejects different mechanics', () => {
    assert.equal(matchesExerciseFilters(deadlift, { mechanics: 'isolation' }), false);
  });

  it('matches movement pattern case-insensitively', () => {
    assert.equal(matchesExerciseFilters(deadlift, { movementPattern: 'HINGE' }), true);
  });

  it('rejects a different movement pattern', () => {
    assert.equal(matchesExerciseFilters(deadlift, { movementPattern: 'squat' }), false);
  });

  it('matches when all criteria match', () => {
    const criteria = { query: 'dead', category: 'strength', muscleGroup: 'hamstrings', mechanics: 'compound' };

    assert.equal(matchesExerciseFilters(deadlift, criteria), true);
  });

  it('rejects when one of several otherwise matching criteria fails', () => {
    const criteria = { query: 'dead', category: 'strength', muscleGroup: 'hamstrings', mechanics: 'isolation' };

    assert.equal(matchesExerciseFilters(deadlift, criteria), false);
  });
});

describe('parseExerciseFilters', () => {
  it('returns empty filters when no params are present', () => {
    assert.deepEqual(parseExerciseFilters(new URLSearchParams(), options), EMPTY_EXERCISE_FILTERS);
  });

  it('reads every param into its filter field', () => {
    const params = new URLSearchParams({
      q: 'curl',
      category: 'strength',
      muscleGroup: 'biceps',
      mechanics: 'isolation',
      movementPattern: 'pull',
    });

    const filters = parseExerciseFilters(params, options);

    assert.deepEqual(filters, {
      query: 'curl',
      category: 'strength',
      muscleGroup: 'biceps',
      mechanics: 'isolation',
      movementPattern: 'pull',
    });
  });

  it('reads a known movement pattern', () => {
    const filters = parseExerciseFilters(new URLSearchParams({ movementPattern: 'bend' }), options);

    assert.equal(filters.movementPattern, 'bend');
  });

  it('returns the movement pattern in its canonical casing', () => {
    const filters = parseExerciseFilters(new URLSearchParams({ movementPattern: 'PuLL' }), options);

    assert.equal(filters.movementPattern, 'pull');
  });

  it('drops a movement pattern that is not among the options', () => {
    const filters = parseExerciseFilters(new URLSearchParams({ movementPattern: 'squat' }), options);

    assert.equal(filters.movementPattern, '');
  });

  it('uses the first value of a repeated param', () => {
    const params = new URLSearchParams([['q', 'first'], ['q', 'second'], ['muscleGroup', 'biceps'], ['muscleGroup', 'lower back']]);

    const filters = parseExerciseFilters(params, options);

    assert.equal(filters.query, 'first');
    assert.equal(filters.muscleGroup, 'biceps');
  });

  it('returns option values in their canonical casing', () => {
    const params = new URLSearchParams({ category: 'STRENGTH', muscleGroup: 'Biceps', mechanics: 'Compound' });

    const filters = parseExerciseFilters(params, options);

    assert.equal(filters.category, 'strength');
    assert.equal(filters.muscleGroup, 'biceps');
    assert.equal(filters.mechanics, 'compound');
  });

  it('drops values that are not among the options', () => {
    const params = new URLSearchParams({ category: 'yoga', muscleGroup: 'back', mechanics: 'hybrid' });

    const filters = parseExerciseFilters(params, options);

    assert.equal(filters.category, '');
    assert.equal(filters.muscleGroup, '');
    assert.equal(filters.mechanics, '');
  });

  it('keeps a query of exactly the maximum length', () => {
    const query = 'a'.repeat(MAX_QUERY_LENGTH);

    const filters = parseExerciseFilters(new URLSearchParams({ q: query }), options);

    assert.equal(filters.query, query);
  });

  it('truncates a query longer than the maximum length', () => {
    const query = 'a'.repeat(MAX_QUERY_LENGTH) + 'overflow';

    const filters = parseExerciseFilters(new URLSearchParams({ q: query }), options);

    assert.equal(filters.query, 'a'.repeat(MAX_QUERY_LENGTH));
  });
});

describe('exerciseFiltersToSearchParams', () => {
  it('maps every set field to its param key', () => {
    const filters = {
      query: 'curl',
      category: 'strength',
      muscleGroup: 'biceps',
      mechanics: 'isolation',
      movementPattern: 'pull',
    };

    const params = exerciseFiltersToSearchParams(filters);

    assert.equal(params.toString(), 'q=curl&category=strength&muscleGroup=biceps&mechanics=isolation&movementPattern=pull');
  });

  it('writes the movement pattern under the movementPattern key', () => {
    const params = exerciseFiltersToSearchParams({ movementPattern: 'bend' });

    assert.equal(params.toString(), 'movementPattern=bend');
  });

  it('omits empty fields', () => {
    const params = exerciseFiltersToSearchParams({ ...EMPTY_EXERCISE_FILTERS, mechanics: 'compound' });

    assert.equal(params.toString(), 'mechanics=compound');
  });
});

describe('exerciseListHref', () => {
  it('returns the bare list path without filters', () => {
    assert.equal(exerciseListHref({}), '/exercises');
  });

  it('returns the bare list path when all filters are empty', () => {
    assert.equal(exerciseListHref(EMPTY_EXERCISE_FILTERS), '/exercises');
  });

  it('encodes the filters as a query string', () => {
    assert.equal(exerciseListHref({ muscleGroup: 'lower back' }), '/exercises?muscleGroup=lower+back');
  });
});

describe('hasActiveExerciseFilters', () => {
  it('is false for empty filters', () => {
    assert.equal(hasActiveExerciseFilters(EMPTY_EXERCISE_FILTERS), false);
  });

  for (const field of ['query', 'category', 'muscleGroup', 'mechanics', 'movementPattern'] as const) {
    it(`is true when only ${field} is set`, () => {
      const filters = { ...EMPTY_EXERCISE_FILTERS, [field]: 'x' };

      assert.equal(hasActiveExerciseFilters(filters), true);
    });
  }
});
