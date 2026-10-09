export function exerciseVideoSearchUrl(exerciseName: string): string {
  const url = new URL('https://www.youtube.com/results');
  url.searchParams.set('search_query', `${exerciseName} form`);
  return url.toString();
}

export function exerciseDetailPath(exerciseId: string): string {
  return `/exercises/${encodeURIComponent(exerciseId)}`;
}

export function withExerciseLinks<T extends { id: string; name: string }>(
  exercise: T,
  origin: string,
): T & { detail_url: string; video_url: string } {
  return {
    ...exercise,
    detail_url: new URL(exerciseDetailPath(exercise.id), origin).toString(),
    video_url: exerciseVideoSearchUrl(exercise.name),
  };
}
