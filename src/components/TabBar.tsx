import { CalendarCheck, ChartNoAxesColumn, Dumbbell, Trophy } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { TAPE_S } from '../lib/motion'

export type TabId = 'today' | 'exercises' | 'progress' | 'achievements'

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <CalendarCheck size={24} aria-hidden="true" /> },
  { id: 'exercises', label: 'Exercises', icon: <Dumbbell size={24} aria-hidden="true" /> },
  { id: 'progress', label: 'Progress', icon: <ChartNoAxesColumn size={24} aria-hidden="true" /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy size={24} aria-hidden="true" /> },
]

interface TabBarProps {
  current: TabId
  onChange: (tab: TabId) => void
}

/** The one floating element on the main screens. The current tab is marked with a tape bar. */
export function TabBar({ current, onChange }: TabBarProps) {
  const reduce = useReducedMotion()
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-line bg-ground pb-[env(safe-area-inset-bottom,0px)]"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="tab-bar"
    >
      <ul className="m-0 grid list-none grid-cols-4 p-0">
        {TABS.map((t) => {
          const on = t.id === current
          return (
            <li key={t.id}>
              <button
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() =>
                  on
                    ? window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
                    : onChange(t.id)
                }
                className={`press relative flex h-16 w-full flex-col items-center justify-center gap-1 ${on ? 'text-ink' : 'text-muted'}`}
              >
                {on && (
                  <span
                    className="absolute top-0 left-1/2 h-1 w-12 -translate-x-1/2"
                    style={{ '--cut': '4px' } as CSSProperties}
                    aria-hidden="true"
                  >
                    <motion.span
                      key={t.id}
                      className="tape-cut tape-fill block h-full w-full"
                      initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%)' }}
                      animate={{ clipPath: 'polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%)' }}
                      transition={{ duration: reduce ? 0 : TAPE_S, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                )}
                {t.icon}
                <span className="text-[15px] leading-none font-semibold max-[420px]:text-[13px] max-[340px]:text-[12px]">{t.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
