import type { CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { ExerciseRow } from '../components/ExerciseRow'
import type { Session } from '../types'

interface ExercisesScreenProps {
  session: Session
  onStart: () => void
}

export function ExercisesScreen({ session, onStart }: ExercisesScreenProps) {
  const n = session.exercises.length
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="exercises"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Exercises</h1>
          <p className="m-0 text-lg text-muted">
            {n} {n === 1 ? 'exercise' : 'exercises'} in your plan
          </p>
        </header>
        {n === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No exercises yet"
            body="Your exercises will be listed here once you choose a programme."
            actionLabel="Choose a programme"
            onAction={onStart}
          />
        ) : (
          <ul className="m-0 flex list-none flex-col p-0" data-testid="exercise-list">
            {session.exercises.map((e) => (
              <ExerciseRow key={e.id} exercise={e} />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
