import Link from 'next/link';

interface ExerciseCardProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

// Children that are links need z-10 (see FilterBadge) to stay above the stretched title link.
export default function ExerciseCard({ id, name, children }: ExerciseCardProps) {
  return (
    <article className="glass relative flex w-full flex-col gap-3 rounded-3xl p-5 transition hover:shadow-xl motion-safe:hover:-translate-y-0.5">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        <Link
          href={`/exercises/${id}`}
          className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-500"
        >
          {name}
        </Link>
      </h3>
      {children}
    </article>
  );
}
