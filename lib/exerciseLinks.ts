export function exerciseVideoSearchUrl(exerciseName: string): string {
  const url = new URL('https://www.youtube.com/results');
  url.searchParams.set('search_query', `${exerciseName} form`);
  return url.toString();
}
