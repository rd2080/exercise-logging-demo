import { Bookmark, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Exercise } from '../types'
import { CATEGORY_LABELS, EQUIPMENT_LABELS, LEVEL_LABELS } from '../lib/library'
import { ExerciseThumb } from './DemoFigure'
import { TYPE_META, rowSummary } from '../lib/tracking'

interface ExerciseRowProps {
  exercise: Exercise
  /** Colour the slot by tracking type (a key on the Exercises list). Neutral when false. */
  keyed?: boolean
  /** Stop the name at two lines. The Exercises list shows full names instead. */
  clamp?: boolean
  /** Makes the whole row a button that opens the exercise. */
  onOpen?: (id: string) => void
  /** Also show the equipment and level (the library list). */
  showAttributes?: boolean
  /** The person has saved this exercise. */
  saved?: boolean
}

/** One exercise as a flat row: a slanted slot, its name, its type and its target. */
export function ExerciseRow({ exercise, keyed = false, clamp = false, onOpen, showAttributes = false, saved = false }: ExerciseRowProps) {
  const meta = TYPE_META[exercise.trackingType]
  const inner = (
    <>
      <span
        className={`tape-cut mt-0.5 h-14 w-3 shrink-0 ${keyed ? 'tape-fill' : 'bg-line'}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span
          className={`font-display text-xl leading-tight font-semibold [overflow-wrap:anywhere] ${clamp ? 'line-clamp-2' : ''}`}
          title={clamp ? exercise.name : undefined}
        >
          {exercise.name}
          {saved && (
            <>
              <Bookmark size={18} className="ml-2 inline-block align-[-2px] text-muted" fill="currentColor" aria-hidden="true" />
              <span className="sr-only"> (saved)</span>
            </>
          )}
        </span>
        <span className="text-[17px] text-pretty text-muted">
          {meta.label} · {rowSummary(exercise)}
        </span>
        {showAttributes && exercise.equipment && exercise.level && (
          <span className="text-[15px] text-pretty text-muted">
            {exercise.category && <span className="whitespace-nowrap">{CATEGORY_LABELS[exercise.category]} · </span>}
            <span className="whitespace-nowrap">{EQUIPMENT_LABELS[exercise.equipment]}</span>
            {' · '}
            <span className="whitespace-nowrap">{LEVEL_LABELS[exercise.level]}</span>
          </span>
        )}
      </span>
      {showAttributes && (
        <ExerciseThumb exerciseId={exercise.id} caption={exercise.category ? CATEGORY_LABELS[exercise.category] : ''} />
      )}
    </>
  )
  const layout = 'flex min-h-[72px] w-full items-start gap-3 py-3 max-[360px]:gap-2'
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
          <ChevronRight size={24} className="mt-[18px] shrink-0 text-muted" aria-hidden="true" />
        </button>
      ) : (
        <div className={layout}>{inner}</div>
      )}
    </li>
  )
}
