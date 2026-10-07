import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_EXERCISE_LIST_VIEW,
  exerciseListViewToSearchParams,
  groupExercises,
  parseExerciseListView,
  sortExercises,
  type ExerciseListView,
  type ListableExercise,
} from './exerciseList.ts';

function exercise(
  name: string,
  movement_pattern: string,
  mechanics: string,
  muscle_groups: string[],
): ListableExercise {
  return { name, movement_pattern, mechanics, muscle_groups };
}

const tableByMuscleGroup: ExerciseListView = { layout: 'table', groupBy: 'muscleGroup', sortBy: 'mechanics' };

function names(exercises: ListableExercise[]): string[] {
  return exercises.map((item) => item.name);
}

describe('parseExerciseListView', () => {
  it('reads valid layout, groupBy and sortBy values', () => {
    const params = new URLSearchParams({ layout: 'table', groupBy: 'movementPattern', sortBy: 'mechanics' });

    const view = parseExerciseListView(params, DEFAULT_EXERCISE_LIST_VIEW);

    assert.deepEqual(view, { layout: 'table', groupBy: 'movementPattern', sortBy: 'mechanics' });
  });

  it('uses the given fallback when params are missing', () => {
    const view = parseExerciseListView(new URLSearchParams(), tableByMuscleGroup);

    assert.deepEqual(view, tableByMuscleGroup);
  });

  it('uses the given fallback for invalid values', () => {
    const params = new URLSearchParams({ layout: 'grid', groupBy: 'category', sortBy: 'TABLE' });

    const view = parseExerciseListView(params, tableByMuscleGroup);

    assert.deepEqual(view, tableByMuscleGroup);
  });

  it('matches values case-sensitively', () => {
    const params = new URLSearchParams({ layout: 'Cards', groupBy: 'MovementPattern', sortBy: 'Name' });

    const view = parseExerciseListView(params, tableByMuscleGroup);

    assert.deepEqual(view, tableByMuscleGroup);
  });
});

describe('exerciseListViewToSearchParams', () => {
  it('keeps the existing params and appends non-default view values', () => {
    const params = new URLSearchParams({ q: 'curl', muscleGroup: 'biceps' });

    const result = exerciseListViewToSearchParams(tableByMuscleGroup, params);

    assert.equal(result.toString(), 'q=curl&muscleGroup=biceps&layout=table&groupBy=muscleGroup&sortBy=mechanics');
  });

  it('omits view values that equal the default', () => {
    const params = new URLSearchParams({ q: 'curl' });

    const result = exerciseListViewToSearchParams(DEFAULT_EXERCISE_LIST_VIEW, params);

    assert.equal(result.toString(), 'q=curl');
  });

  it('writes only the view values that differ from the default', () => {
    const view: ExerciseListView = { ...DEFAULT_EXERCISE_LIST_VIEW, sortBy: 'movementPattern' };

    const result = exerciseListViewToSearchParams(view, new URLSearchParams());

    assert.equal(result.toString(), 'sortBy=movementPattern');
  });

  it('does not mutate the input params', () => {
    const params = new URLSearchParams({ q: 'curl' });

    exerciseListViewToSearchParams(tableByMuscleGroup, params);

    assert.equal(params.toString(), 'q=curl');
  });
});

describe('sortExercises', () => {
  const curl = exercise('Curl', 'Pull', 'Isolation', ['Biceps']);
  const bench = exercise('Bench Press', 'Push', 'Compound', ['Chest', 'Triceps']);
  const row = exercise('Row', 'Pull', 'Compound', ['Back', 'Biceps']);
  const apull = exercise('Archer Pull', 'Pull', 'Compound', ['Back']);

  it('sorts ascending by name', () => {
    const sorted = sortExercises([row, curl, bench], 'name');

    assert.deepEqual(names(sorted), ['Bench Press', 'Curl', 'Row']);
  });

  it('sorts ascending by movement pattern', () => {
    const sorted = sortExercises([bench, curl], 'movementPattern');

    assert.deepEqual(names(sorted), ['Curl', 'Bench Press']);
  });

  it('sorts ascending by mechanics', () => {
    const sorted = sortExercises([curl, row], 'mechanics');

    assert.deepEqual(names(sorted), ['Row', 'Curl']);
  });

  it('breaks movement pattern ties by name', () => {
    const sorted = sortExercises([row, curl, apull], 'movementPattern');

    assert.deepEqual(names(sorted), ['Archer Pull', 'Curl', 'Row']);
  });

  it('breaks mechanics ties by name', () => {
    const sorted = sortExercises([row, bench, apull], 'mechanics');

    assert.deepEqual(names(sorted), ['Archer Pull', 'Bench Press', 'Row']);
  });

  it('does not mutate the input array', () => {
    const input = [row, curl, bench];

    sortExercises(input, 'name');

    assert.deepEqual(names(input), ['Row', 'Curl', 'Bench Press']);
  });
});

describe('groupExercises', () => {
  const curl = exercise('Curl', 'Pull', 'Isolation', ['Biceps']);
  const row = exercise('Row', 'Pull', 'Compound', ['Back', 'Biceps']);
  const bench = exercise('Bench Press', 'Push', 'Compound', ['Chest', 'Triceps']);
  const squat = exercise('Squat', 'Squat', 'Compound', ['Quads']);

  it('returns no groups for an empty input', () => {
    assert.deepEqual(groupExercises([], 'muscleGroup'), []);
  });

  it('puts every exercise into a single group for none', () => {
    const groups = groupExercises([curl, row, bench], 'none');

    assert.deepEqual(groups, [{ key: '', exercises: [curl, row, bench] }]);
  });

  it('puts each exercise into exactly one movement pattern group', () => {
    const groups = groupExercises([curl, bench, row], 'movementPattern');

    assert.deepEqual(groups, [
      { key: 'Pull', exercises: [curl, row] },
      { key: 'Push', exercises: [bench] },
    ]);
  });

  it('puts an exercise into every group of its muscle groups', () => {
    const groups = groupExercises([row], 'muscleGroup');

    assert.deepEqual(groups, [
      { key: 'Back', exercises: [row] },
      { key: 'Biceps', exercises: [row] },
    ]);
  });

  it('orders groups by size descending', () => {
    const groups = groupExercises([bench, curl, row], 'muscleGroup');

    assert.equal(groups[0].key, 'Biceps');
  });

  it('orders equally sized groups by key ascending', () => {
    const groups = groupExercises([squat, bench], 'movementPattern');

    assert.deepEqual(
      groups.map((group) => group.key),
      ['Push', 'Squat'],
    );
  });

  it('preserves the input order within a group', () => {
    const groups = groupExercises([row, curl], 'muscleGroup');

    const biceps = groups.find((group) => group.key === 'Biceps');
    assert.deepEqual(biceps?.exercises, [row, curl]);
  });
});
