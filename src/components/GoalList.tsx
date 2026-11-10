import { TAPE_S } from '../lib/motion'
import { Check, Lock } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

export interface Goal {
  id: string
  title: string
  requirement: string
  target: number
}

interface GoalListProps {
  goals: Goal[]
  /** Count reached per goal id. Missing means zero. */
  progress: Record<string, number>
}

function GoalSlot({ unlocked, next }: { unlocked: boolean; next: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span
      className="tape-cut relative grid h-11 w-12 shrink-0 place-items-center overflow-hidden bg-surface-2"
      style={{ '--cut': '8px' } as CSSProperties}
      aria-hidden="true"
    >
      {unlocked ? (
        <motion.span
          className="tape-fill absolute inset-0 grid place-items-center text-on-tape"
          initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%)' }}
          animate={{ clipPath: 'polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%)' }}
          transition={{ duration: reduce ? 0 : TAPE_S, ease: [0.16, 1, 0.3, 1] }}
        >
          <Check size={22} strokeWidth={3} />
        </motion.span>
      ) : (
        <Lock size={20} strokeWidth={2.5} className="text-muted" />
      )}
      {next && <span className="absolute inset-x-0 bottom-0 h-1 bg-(--tape)" />}
    </span>
  )
}

/** Goals shown up front, locked until reached, so a new user has something to aim at. */
export function GoalList({ goals, progress }: GoalListProps) {
  const firstLocked = goals.findIndex((g) => (progress[g.id] ?? 0) < g.target)
  return (
    <ul className="m-0 flex list-none flex-col p-0" data-testid="goal-list">
      {goals.map((g, i) => {
        const count = Math.min(progress[g.id] ?? 0, g.target)
        const unlocked = count >= g.target
        return (
          <li
            key={g.id}
            className="flex min-h-[72px] items-start gap-3 border-t border-line py-3 first:border-t-0"
            aria-label={`${g.title}: ${g.requirement}. ${unlocked ? 'Unlocked' : 'Locked'}, ${count} of ${g.target}`}
          >
            <GoalSlot unlocked={unlocked} next={i === firstLocked} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-display text-xl leading-tight font-semibold">{g.title}</span>
              <span className="text-[17px] text-pretty text-muted">{g.requirement}</span>
            </span>
            {g.target > 5 && (
              <span className="num shrink-0 pt-1 text-lg font-semibold whitespace-nowrap text-muted" aria-hidden="true">
                {count} of {g.target}
              </span>
            )}
            {g.target > 1 && g.target <= 5 && (
              <span
                className="flex w-20 shrink-0 gap-1 pt-3"
                style={{ '--cut': '4px' } as CSSProperties}
                aria-hidden="true"
              >
                {Array.from({ length: g.target }, (_, k) => (
                  <span key={k} className={`tape-cut h-3 flex-1 ${k < count ? 'tape-fill' : 'bg-surface-2'}`} />
                ))}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
