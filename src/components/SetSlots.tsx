import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { Exercise, SetValues } from '../types'
import { SLOT_MIN, formatCompact, formatValues } from '../lib/tracking'
import { TAPE_S } from '../lib/motion'

interface SetSlotsProps {
  exercise: Exercise
  logged: SetValues[]
  active: boolean
}

export function SetSlots({ exercise, logged, active }: SetSlotsProps) {
  const reduce = useReducedMotion()
  const slots = Array.from({ length: exercise.sets }, (_, i) => i)
  return (
    <ol
      className="m-0 grid list-none gap-1 p-0"
      style={
        {
          '--cut': '10px',
          gridTemplateColumns: `repeat(auto-fit, minmax(${SLOT_MIN[exercise.trackingType]}, 1fr))`,
        } as CSSProperties
      }
      aria-label="Sets"
      data-testid="set-slots"
    >
      {slots.map((i) => {
        const done = logged[i]
        const isCurrent = active && i === logged.length
        const short = done ? formatCompact(exercise.trackingType, done) : ''
        return (
          <li
            key={i}
            className={`tape-cut relative flex min-w-0 items-center justify-center overflow-hidden bg-surface-2 px-2 ${exercise.sets > 5 ? 'h-10' : 'h-14 short:h-12'}`}
            aria-label={
              done
                ? `Set ${i + 1}: ${formatValues(exercise.trackingType, done)}`
                : `Set ${i + 1}: not logged`
            }
            aria-current={isCurrent ? 'step' : undefined}
          >
            {done ? (
              <motion.span
                key={`done-${i}`}
                className="tape-fill absolute inset-0 flex items-center justify-center px-2 text-on-tape"
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%)' }}
                animate={{ clipPath: 'polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%)' }}
                transition={{ duration: reduce ? 0 : TAPE_S, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className={`num font-bold whitespace-nowrap ${short.length > 6 ? 'text-base' : 'text-xl'}`}
                >
                  {short}
                </span>
              </motion.span>
            ) : (
              <span
                className={`num text-lg font-semibold ${isCurrent ? 'text-(--tape)' : 'text-muted'}`}
              >
                {i + 1}
              </span>
            )}
            {isCurrent && (
              <span className="absolute inset-x-0 bottom-0 tape-fill h-1" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
