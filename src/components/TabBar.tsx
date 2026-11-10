import { CalendarCheck, ChartNoAxesColumn, Dumbbell } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export type TabId = 'today' | 'exercises' | 'progress'

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <CalendarCheck size={24} aria-hidden="true" /> },
  { id: 'exercises', label: 'Exercises', icon: <Dumbbell size={24} aria-hidden="true" /> },
  { id: 'progress', label: 'Progress', icon: <ChartNoAxesColumn size={24} aria-hidden="true" /> },
]

interface TabBarProps {
  current: TabId
  onChange: (tab: TabId) => void
}

/** The one floating element on the main screens. The current tab is marked with a tape bar. */
export function TabBar({ current, onChange }: TabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-line bg-ground pb-[env(safe-area-inset-bottom,0px)]"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="tab-bar"
    >
      <ul className="m-0 grid list-none grid-cols-3 p-0">
        {TABS.map((t) => {
          const on = t.id === current
          return (
            <li key={t.id}>
              <button
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => !on && onChange(t.id)}
                className={`press relative flex h-16 w-full flex-col items-center justify-center gap-1 ${on ? 'text-ink' : 'text-muted'}`}
              >
                {on && (
                  <span
                    className="absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 bg-(--tape)"
                    aria-hidden="true"
                  />
                )}
                {t.icon}
                <span className="text-[15px] leading-none font-semibold">{t.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
