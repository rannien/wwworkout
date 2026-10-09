import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { exerciseDetailPath, exerciseVideoSearchUrl, withExerciseLinks } from './exerciseLinks.ts';

describe('exerciseVideoSearchUrl', () => {
  it('points to the YouTube search results page over https', () => {
    const name = 'Bench Press';

    const url = new URL(exerciseVideoSearchUrl(name));

    assert.equal(url.origin, 'https://www.youtube.com');
    assert.equal(url.pathname, '/results');
  });

  it('searches for the exercise name followed by "form"', () => {
    const name = 'Romanian Deadlift';

    const url = new URL(exerciseVideoSearchUrl(name));

    assert.equal(url.searchParams.get('search_query'), 'Romanian Deadlift form');
  });

  it('round-trips names with special characters exactly', () => {
    const names = ['Face Pull (rope)', 'Close-Grip Bench Press', 'EZ-bar & Cable', '100% Squat #2'];

    const queries = names.map((name) => new URL(exerciseVideoSearchUrl(name)).searchParams.get('search_query'));

    assert.deepEqual(
      queries,
      names.map((name) => `${name} form`),
    );
  });

  it('does not let the name inject extra query parameters', () => {
    const name = 'Curl&foo=bar';

    const url = new URL(exerciseVideoSearchUrl(name));

    assert.deepEqual([...url.searchParams.keys()], ['search_query']);
    assert.equal(url.searchParams.get('foo'), null);
  });
});

describe('exerciseDetailPath', () => {
  it('builds the exercise detail path from the id', () => {
    const id = '82';

    const path = exerciseDetailPath(id);

    assert.equal(path, '/exercises/82');
  });

  it('keeps an id with "/" or "?" inside a single path segment', () => {
    const id = 'a/b?c=d#e';

    const url = new URL(exerciseDetailPath(id), 'https://example.test');

    const segments = url.pathname.split('/').filter(Boolean);
    assert.equal(segments.length, 2);
    assert.equal(segments[0], 'exercises');
    assert.equal(decodeURIComponent(segments[1]), id);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
  });
});

describe('withExerciseLinks', () => {
  const origin = 'https://wwworkout.vercel.app';

  it('adds an absolute detail_url built from the origin and the id', () => {
    const exercise = { id: '82', name: 'Bench Press' };

    const linked = withExerciseLinks(exercise, origin);

    assert.equal(linked.detail_url, 'https://wwworkout.vercel.app/exercises/82');
  });

  it('does not double the slash when the origin ends with one', () => {
    const exercise = { id: '82', name: 'Bench Press' };

    const linked = withExerciseLinks(exercise, `${origin}/`);

    assert.equal(linked.detail_url, 'https://wwworkout.vercel.app/exercises/82');
  });

  it('adds a video_url equal to the video search url for the name', () => {
    const exercise = { id: '82', name: 'Romanian Deadlift' };

    const linked = withExerciseLinks(exercise, origin);

    assert.equal(linked.video_url, exerciseVideoSearchUrl('Romanian Deadlift'));
  });

  it('preserves every original field', () => {
    const exercise = {
      id: '82',
      name: 'Bench Press',
      muscles: ['chest', 'triceps'],
      sets: 3,
    };

    const linked = withExerciseLinks(exercise, origin);

    assert.deepEqual(
      {
        id: linked.id,
        name: linked.name,
        muscles: linked.muscles,
        sets: linked.sets,
      },
      { id: '82', name: 'Bench Press', muscles: ['chest', 'triceps'], sets: 3 },
    );
  });

  it('does not mutate the input exercise', () => {
    const exercise = { id: '82', name: 'Bench Press' };

    const linked = withExerciseLinks(exercise, origin);

    assert.notEqual(linked, exercise);
    assert.deepEqual(exercise, { id: '82', name: 'Bench Press' });
  });
});
