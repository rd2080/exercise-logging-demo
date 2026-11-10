import { TAPE_S } from '../lib/motion'
import { motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'

interface SlotProps {
  /** Number shown while unfilled. */
  n: number
  filled: boolean
  /** Render a rank number on the tape instead of a check. */
  rank?: number
}

/** A small slot of route tape. Filling it lays a grain strip on a slanted leading edge. */
export function Slot({ n, filled, rank }: SlotProps) {
  const reduce = useReducedMotion()
  return (
    <span
      className="tape-cut relative grid h-11 w-12 shrink-0 place-items-center overflow-hidden bg-surface-2"
      style={{ '--cut': '8px' } as CSSProperties}
      aria-hidden="true"
    >
      {filled ? (
        <motion.span
          key="filled"
          className="tape-fill absolute inset-0 grid place-items-center text-on-tape"
          initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%)' }}
          animate={{ clipPath: 'polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%)' }}
          transition={{ duration: reduce ? 0 : TAPE_S, ease: [0.16, 1, 0.3, 1] }}
        >
          {rank ? (
            <span className="num text-xl font-bold">{rank}</span>
          ) : (
            <Check size={22} strokeWidth={3} />
          )}
        </motion.span>
      ) : (
        n > 0 && <span className="num text-lg font-semibold text-muted">{n}</span>
      )}
    </span>
  )
}
