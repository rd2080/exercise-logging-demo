import type { Exercise } from '../types'
import { TYPE_META } from '../lib/tracking'

interface SessionTapeProps {
  exercises: Exercise[]
  current: number
  loggedCounts: number[]
}

export function SessionTape({ exercises, current, loggedCounts }: SessionTapeProps) {
  return (
    <ol className="m-0 flex list-none gap-1 p-0" aria-label="Workout progress">
      {exercises.map((ex, i) => {
        const fill = Math.min(1, loggedCounts[i] / ex.sets)
        const tape = TYPE_META[ex.trackingType].tape
        const isCurrent = i === current
        return (
          <li
            key={ex.id}
            className={`tape-cut flex-1 self-center overflow-hidden bg-surface-2 ${isCurrent ? 'h-4' : 'h-3'}`}
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`${ex.name}, ${loggedCounts[i]} of ${ex.sets} sets logged`}
            style={
              isCurrent
                ? { backgroundColor: `color-mix(in oklab, ${tape} 42%, var(--color-surface-2))` }
                : undefined
            }
          >
            <div
              className="tape-fill h-full origin-left transition-transform duration-300 ease-(--ease-out-expo) motion-reduce:transition-none"
              style={{ '--tape': tape, transform: `scaleX(${fill})` } as React.CSSProperties}
            />
          </li>
        )
      })}
    </ol>
  )
}
