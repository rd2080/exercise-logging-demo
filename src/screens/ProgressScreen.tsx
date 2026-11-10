import type { CSSProperties } from 'react'
import { goalsData as goalData } from '../data/fixtures'
import { EmptyState } from '../components/EmptyState'
import { GoalList, type Goal } from '../components/GoalList'

interface ProgressScreenProps {
  onStart: () => void
}

/** Five empty tape slots. The first is marked as the next one to fill. */
function EmptySlots() {
  return (
    <div className="flex gap-1" style={{ '--cut': '12px' } as CSSProperties}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="tape-cut relative h-16 flex-1 overflow-hidden bg-surface-2">
          {i === 0 && (
            <span
              className="tape-fill absolute inset-y-0 left-0 my-auto h-6 w-[58%]"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            />
          )}
        </span>
      ))}
    </div>
  )
}

export function ProgressScreen({ onStart }: ProgressScreenProps) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="progress"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-12">
        <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Progress</h1>
        <EmptyState
          illustration={<EmptySlots />}
          title="Your sets will be logged here"
          body="Log a set in any workout. It shows up here with what you did, next to what you did last time."
          actionLabel="Start your first workout"
          onAction={onStart}
        />
        <section className="flex flex-col gap-1" aria-labelledby="goals-heading">
          <h2 id="goals-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            Goals to unlock
          </h2>
          <GoalList
            goals={goalData.goals as Goal[]}
            progress={goalData.progress as Record<string, number>}
          />
        </section>
      </main>
    </div>
  )
}
