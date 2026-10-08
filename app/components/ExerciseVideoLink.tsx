import { exerciseVideoSearchUrl } from '@/lib/exerciseLinks';

export default function ExerciseVideoLink({ exerciseName }: { exerciseName: string }) {
  return (
    <a
      href={exerciseVideoSearchUrl(exerciseName)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${exerciseName} tutorial on YouTube (opens in a new tab)`}
      title="Watch on YouTube"
      className="glass-strong inline-flex size-11 shrink-0 items-center justify-center rounded-full text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 translate-x-px fill-current">
        <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
      </svg>
    </a>
  );
}
