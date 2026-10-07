'use client';

import Link from 'next/link';
import { useState } from 'react';
import { muscleColor } from '@/app/components/muscleColors';
import { exerciseListHref } from '@/lib/exerciseFilters';

interface MuscleGroupCount {
  muscleGroup: string;
  count: number;
}

interface BodyMapProps {
  muscleGroups: MuscleGroupCount[];
}

const NEUTRAL = 'fill-zinc-900/10 dark:fill-white/10';

const SILHOUETTE = (
  <g className={NEUTRAL}>
    <circle cx="100" cy="30" r="20" />
    <rect x="91" y="48" width="18" height="14" rx="5" />
    <ellipse cx="46" cy="160" rx="8" ry="22" />
    <ellipse cx="154" cy="160" rx="8" ry="22" />
    <circle cx="44" cy="191" r="7" />
    <circle cx="156" cy="191" r="7" />
    <rect x="74" y="164" width="52" height="28" rx="12" />
    <rect x="77" y="284" width="18" height="80" rx="9" />
    <rect x="105" y="284" width="18" height="80" rx="9" />
    <ellipse cx="85" cy="372" rx="12" ry="6" />
    <ellipse cx="115" cy="372" rx="12" ry="6" />
  </g>
);

const SHOULDER_SHAPES = (
  <>
    <ellipse cx="64" cy="78" rx="17" ry="14" />
    <ellipse cx="136" cy="78" rx="17" ry="14" />
  </>
);

const UPPER_ARM_SHAPES = (
  <>
    <ellipse cx="52" cy="114" rx="10" ry="22" />
    <ellipse cx="148" cy="114" rx="10" ry="22" />
  </>
);

const FRONT_MUSCLES: Record<string, React.ReactNode> = {
  shoulders: SHOULDER_SHAPES,
  chest: (
    <>
      <rect x="70" y="66" width="29" height="34" rx="10" />
      <rect x="101" y="66" width="29" height="34" rx="10" />
    </>
  ),
  biceps: UPPER_ARM_SHAPES,
  abs: <rect x="78" y="104" width="44" height="58" rx="10" />,
  quadriceps: (
    <>
      <rect x="72" y="194" width="26" height="86" rx="13" />
      <rect x="102" y="194" width="26" height="86" rx="13" />
    </>
  ),
};

const BACK_MUSCLES: Record<string, React.ReactNode> = {
  traps: <polygon points="100,50 124,68 100,84 76,68" />,
  'rear delts': SHOULDER_SHAPES,
  'upper back': <rect x="80" y="86" width="40" height="30" rx="8" />,
  lats: (
    <>
      <polygon points="68,92 79,116 97,119 97,144 86,150 72,122" />
      <polygon points="132,92 121,116 103,119 103,144 114,150 128,122" />
    </>
  ),
  triceps: UPPER_ARM_SHAPES,
  'lower back': <rect x="84" y="150" width="32" height="14" rx="6" />,
  glutes: (
    <>
      <ellipse cx="88" cy="182" rx="14" ry="14" />
      <ellipse cx="112" cy="182" rx="14" ry="14" />
    </>
  ),
  hamstrings: (
    <>
      <rect x="72" y="198" width="26" height="80" rx="13" />
      <rect x="102" y="198" width="26" height="80" rx="13" />
    </>
  ),
  calves: (
    <>
      <ellipse cx="86" cy="312" rx="11" ry="26" />
      <ellipse cx="114" cy="312" rx="11" ry="26" />
    </>
  ),
};

export default function BodyMap({ muscleGroups }: BodyMapProps) {
  const [activeMuscle, setActiveMuscle] = useState<string | null>(null);
  const countByMuscle = new Map(muscleGroups.map(({ muscleGroup, count }) => [muscleGroup, count]));
  const activeCount = activeMuscle ? countByMuscle.get(activeMuscle) : undefined;

  const renderFigure = (label: string, muscles: Record<string, React.ReactNode>) => (
    <figure aria-hidden="true" className="flex flex-col items-center gap-2">
      {/* Pointer shortcut only; the muscle list below is the keyboard and screen reader path. */}
      <svg viewBox="0 0 200 384" className="h-auto w-full max-w-44">
        {SILHOUETTE}
        {Object.entries(muscles).map(([muscle, shapes]) => (
          <Link
            key={muscle}
            href={exerciseListHref({ muscleGroup: muscle })}
            tabIndex={-1}
            onMouseEnter={() => setActiveMuscle(muscle)}
            onMouseLeave={() => setActiveMuscle(null)}
          >
            <g
              className={`${muscleColor(muscle).fill} cursor-pointer stroke-white/70 stroke-[1.5] transition-opacity duration-200 motion-reduce:transition-none dark:stroke-white/30 ${
                activeMuscle && activeMuscle !== muscle ? 'opacity-25' : 'opacity-90'
              }`}
            >
              {shapes}
            </g>
          </Link>
        ))}
      </svg>
      <figcaption className="font-mono text-xs tracking-widest text-zinc-600 uppercase dark:text-zinc-400">
        {label}
      </figcaption>
    </figure>
  );

  const renderLegend = (label: string, muscles: Record<string, React.ReactNode>) => (
    <ul aria-label={label} className="flex flex-col">
      {Object.keys(muscles).map(muscle => (
        <li key={muscle}>
          <Link
            href={exerciseListHref({ muscleGroup: muscle })}
            onMouseEnter={() => setActiveMuscle(muscle)}
            onMouseLeave={() => setActiveMuscle(null)}
            onFocus={() => setActiveMuscle(muscle)}
            onBlur={() => setActiveMuscle(null)}
            className={`flex min-h-9 items-center gap-2.5 rounded-xl px-2.5 text-sm capitalize transition motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-sky-500 ${
              activeMuscle === muscle ? 'bg-white/60 dark:bg-white/10' : ''
            }`}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5 shrink-0">
              <circle cx="5" cy="5" r="5" className={muscleColor(muscle).fill} />
            </svg>
            <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-50">{muscle}</span>
            <span className="font-mono text-xs text-zinc-600 tabular-nums dark:text-zinc-400">
              {countByMuscle.get(muscle) ?? 0}
              <span className="sr-only"> exercises</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="glass rounded-4xl p-4 sm:p-6">
      <p aria-hidden="true" className="mb-2 h-5 text-center font-mono text-xs tracking-widest text-zinc-700 uppercase dark:text-zinc-300">
        {activeMuscle ? `${activeMuscle} · ${activeCount ?? 0} exercises` : 'Tap a muscle'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {renderFigure('Front', FRONT_MUSCLES)}
        {renderFigure('Back', BACK_MUSCLES)}
      </div>
      <nav aria-label="Muscle groups" className="mt-5 grid grid-cols-2 gap-x-2 border-t border-zinc-900/10 pt-4 sm:gap-x-4 dark:border-white/10">
        {renderLegend('Front muscles', FRONT_MUSCLES)}
        {renderLegend('Back muscles', BACK_MUSCLES)}
      </nav>
    </div>
  );
}
