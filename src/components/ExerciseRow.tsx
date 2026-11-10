import type { CSSProperties } from 'react'
import type { Exercise } from '../types'
import { TYPE_META, targetText } from '../lib/tracking'

/** One exercise as a flat row: a tape slot in its tracking-type colour, its name, its type and target. */
export function ExerciseRow({ exercise }: { exercise: Exercise }) {
  const meta = TYPE_META[exercise.trackingType]
  return (
    <li
      className="flex min-h-[72px] items-start gap-3 border-t border-line py-3 first:border-t-0"
      style={{ '--cut': '6px', '--tape': meta.tape } as CSSProperties}
    >
      <span className="tape-cut tape-fill mt-1 h-11 w-3 shrink-0" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display line-clamp-2 text-xl leading-tight font-semibold" title={exercise.name}>
          {exercise.name}
        </span>
        <span className="text-[17px] text-pretty text-muted">
          {meta.label} · {targetText(exercise)}
        </span>
      </span>
    </li>
  )
}
