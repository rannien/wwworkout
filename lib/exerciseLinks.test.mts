import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { exerciseVideoSearchUrl } from './exerciseLinks.ts';

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
