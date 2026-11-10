import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { DAY_LETTERS, DAY_NAMES } from '../lib/weeks'

interface WeekDotsProps {
  /** Which weekdays the programme plans a session on (0 = Monday). */
  planned: boolean[]
  /** Which weekdays have a finished workout logged. */
  done: boolean[]
  /** Today's weekday (0 = Monday). */
  today: number
}

/** Monday to Sunday as seven slots of tape: laid where you trained, outlined where one is planned. */
export function WeekDots({ planned, done, today }: WeekDotsProps) {
  return (
    <ol
      className="m-0 flex list-none gap-1 p-0"
      style={{ '--cut': '6px' } as CSSProperties}
      aria-label="This week"
      data-testid="week-dots"
    >
      {DAY_LETTERS.map((letter, i) => {
        const state = done[i] ? 'done' : planned[i] ? 'planned' : 'rest'
        return (
          <li
            key={i}
            className={`tape-cut relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden ${
              state === 'done'
                ? 'tape-fill text-on-tape'
                : state === 'planned'
                  ? 'bg-surface-2 text-ink'
                  : 'bg-surface-2 text-muted'
            }`}
            aria-label={`${DAY_NAMES[i]}${i === today ? ', today' : ''}: ${
              state === 'done' ? 'workout done' : state === 'planned' ? 'workout planned' : 'rest day'
            }`}
            aria-current={i === today ? 'date' : undefined}
            data-state={state}
            data-today={i === today ? 'true' : undefined}
          >
            {state === 'done' ? (
              <Check size={20} strokeWidth={3} aria-hidden="true" />
            ) : (
              <span className="num text-lg font-semibold" aria-hidden="true">
                {letter}
              </span>
            )}
            {i === today && (
              <span
                className={`absolute inset-x-0 bottom-0 h-1 ${state === 'done' ? 'bg-on-tape' : 'tape-fill'}`}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
