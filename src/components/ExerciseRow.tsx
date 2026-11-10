import type { CSSProperties } from 'react'
import type { Exercise } from '../types'
import { TYPE_META, rowSummary } from '../lib/tracking'

interface ExerciseRowProps {
  exercise: Exercise
  /** Colour the slot by tracking type (a key on the Exercises list). Neutral when false. */
  keyed?: boolean
  /** Stop the name at two lines. The Exercises list shows full names instead. */
  clamp?: boolean
  /** Makes the whole row a button that opens the exercise. */
  onOpen?: (id: string) => void
}

/** One exercise as a flat row: a slanted slot, its name, its type and its target. */
export function ExerciseRow({ exercise, keyed = false, clamp = false, onOpen }: ExerciseRowProps) {
  const meta = TYPE_META[exercise.trackingType]
  const inner = (
    <>
      <span
        className={`tape-cut mt-1 h-11 w-3 shrink-0 ${keyed ? 'tape-fill' : 'bg-line'}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span
          className={`font-display text-xl leading-tight font-semibold [overflow-wrap:anywhere] ${clamp ? 'line-clamp-2' : ''}`}
          title={clamp ? exercise.name : undefined}
        >
          {exercise.name}
        </span>
        <span className="text-[17px] text-pretty text-muted">
          {meta.label} · {rowSummary(exercise)}
        </span>
      </span>
    </>
  )
  const layout = 'flex min-h-[72px] w-full items-start gap-3 py-3'
  return (
    <li
      className="border-t border-line first:border-t-0"
      style={{ '--cut': '6px', '--tape': meta.tape } as CSSProperties}
    >
      {onOpen ? (
        <button
          type="button"
          className={`press ${layout} text-ink`}
          onClick={() => onOpen(exercise.id)}
          data-testid="exercise-open"
        >
          {inner}
        </button>
      ) : (
        <div className={layout}>{inner}</div>
      )}
    </li>
  )
}
