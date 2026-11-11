import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { DAY_NAMES, DAY_SHORT } from '../lib/weeks'

interface WeekDotsProps {
  /** Which weekdays the programme plans a session on (0 = Monday). */
  planned: boolean[]
  /** Which weekdays have a finished workout logged. */
  done: boolean[]
  /** Today's weekday (0 = Monday). */
  today: number
}

type State = 'done' | 'planned' | 'missed' | 'rest'

const LABEL: Record<State, string> = {
  done: 'workout done',
  planned: 'workout planned',
  missed: 'planned, no workout logged',
  rest: 'rest day',
}

/**
 * Monday to Sunday as seven slots of tape: laid where you trained, an ivory label where one is planned,
 * a muted underlined label where a planned day passed without one. Today is marked under its slot.
 */
export function WeekDots({ planned, done, today }: WeekDotsProps) {
  return (
    <ol
      className="m-0 flex list-none gap-1 p-0"
      style={{ '--cut': '6px' } as CSSProperties}
      aria-label="This week"
      data-testid="week-dots"
    >
      {DAY_SHORT.map((short, i) => {
        const state: State = done[i] ? 'done' : planned[i] ? (i < today ? 'missed' : 'planned') : 'rest'
        return (
          <li
            key={i}
            className="flex min-w-0 flex-1 flex-col gap-1"
            aria-label={`${DAY_NAMES[i]}${i === today ? ', today' : ''}: ${LABEL[state]}`}
            aria-current={i === today ? 'date' : undefined}
            data-state={state}
            data-today={i === today ? 'true' : undefined}
          >
            <span
              className={`tape-cut flex h-14 items-center justify-center ${
                state === 'done'
                  ? 'tape-fill text-on-tape'
                  : state === 'planned'
                    ? 'bg-surface-2 text-ink'
                    : 'bg-surface-2 text-muted'
              }`}
            >
              {state === 'done' ? (
                <Check size={20} strokeWidth={3} aria-hidden="true" />
              ) : (
                <span
                  className={`num text-base font-semibold ${state === 'missed' ? 'underline decoration-2 underline-offset-4' : ''}`}
                  aria-hidden="true"
                >
                  {short}
                </span>
              )}
            </span>
            <span
              className={`tape-cut h-1 ${i === today ? 'tape-fill' : ''}`}
              style={{ '--cut': '3px' } as CSSProperties}
              aria-hidden="true"
            />
          </li>
        )
      })}
    </ol>
  )
}
