import type { CSSProperties } from 'react'
import { GoalList, type Goal } from '../components/GoalList'
import { goalsData as goalData } from '../data/fixtures'
import type { Entry } from '../entries'
import { goalProgress } from '../lib/goals'
import type { Exercise } from '../types'

interface AchievementsScreenProps {
  plan: Exercise[]
  entries: Entry[]
}

/** Goals to unlock, kept apart from the log so they stay in view however many sets pile up. */
export function AchievementsScreen({ plan, entries }: AchievementsScreenProps) {
  // What was logged decides the goals. The dev data modes can add fixed values on top to stress the screen.
  const progress: Record<string, number> = { ...goalProgress(entries, plan) }
  for (const [id, n] of Object.entries(goalData.progress as Record<string, number>)) progress[id] = Math.max(progress[id] ?? 0, n)
  const goals = goalData.goals as Goal[]
  const unlocked = goals.filter((g) => (progress[g.id] ?? 0) >= g.target).length
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="achievements"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Achievements</h1>
          <p className="num m-0 text-lg text-muted" data-testid="unlocked-count">
            {unlocked} of {goals.length} unlocked
          </p>
        </header>
        <section aria-labelledby="goals-heading">
          <h2 id="goals-heading" className="sr-only">
            Goals to unlock
          </h2>
          <GoalList goals={goals} progress={progress} />
        </section>
      </main>
    </div>
  )
}
