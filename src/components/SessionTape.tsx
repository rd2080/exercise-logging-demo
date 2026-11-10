import type { CSSProperties } from 'react'
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
            className="relative flex-1"
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`${ex.name}, ${loggedCounts[i]} of ${ex.sets} sets logged`}
          >
            <div
              className={`tape-cut h-3 overflow-hidden ${isCurrent ? 'bg-line' : 'bg-surface-2'}`}
            >
              <div
                className="tape-fill h-full origin-left transition-transform duration-150 ease-(--ease-out-expo) motion-reduce:transition-none"
                style={{ '--tape': tape, transform: `scaleX(${fill})` } as CSSProperties}
              />
            </div>
            {isCurrent && (
              <span
                className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
                style={{ background: tape }}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
