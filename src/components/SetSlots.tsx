import { motion, useReducedMotion } from 'motion/react'
import type { Exercise, SetValues } from '../types'
import { formatValues } from '../lib/tracking'

interface SetSlotsProps {
  exercise: Exercise
  logged: SetValues[]
  active: boolean
}

export function SetSlots({ exercise, logged, active }: SetSlotsProps) {
  const reduce = useReducedMotion()
  const slots = Array.from({ length: exercise.sets }, (_, i) => i)
  return (
    <ol className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Sets" data-testid="set-slots">
      {slots.map((i) => {
        const done = logged[i]
        const isCurrent = active && i === logged.length
        return (
          <li
            key={i}
            className={`relative flex h-14 min-w-[4.5rem] flex-1 items-center justify-center overflow-hidden rounded-2xl px-3 ${
              done ? '' : 'bg-surface-2'
            }`}
            style={isCurrent ? { boxShadow: 'inset 0 0 0 2px var(--tape)' } : undefined}
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
                className="tape-fill absolute inset-0 flex items-center justify-center px-3 text-on-tape"
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%)' }}
                animate={{ clipPath: 'polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%)' }}
                transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="num text-xl font-bold whitespace-nowrap">
                  {formatValues(exercise.trackingType, done)}
                </span>
              </motion.span>
            ) : (
              <span className="num text-lg font-semibold text-muted">{i + 1}</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
