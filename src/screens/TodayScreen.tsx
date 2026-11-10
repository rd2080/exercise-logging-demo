import type { CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { ExerciseRow } from '../components/ExerciseRow'
import type { Session } from '../types'

interface TodayScreenProps {
  session: Session
  onStart: () => void
  onChoose: () => void
}

export function TodayScreen({ session, onStart, onChoose }: TodayScreenProps) {
  const sets = session.exercises.reduce((n, e) => n + e.sets, 0)
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="today"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Today</h1>
          <p className="m-0 line-clamp-2 text-lg text-muted" title={session.name}>
            {session.name}
          </p>
        </header>
        {session.exercises.length === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No workout today"
            body="Choose a programme to get a workout with exercises you can log."
            actionLabel="Choose a programme"
            onAction={onChoose}
          />
        ) : (
          <>
            <button
              type="button"
              className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
              onClick={onStart}
              data-testid="start-workout"
            >
              Start workout
            </button>
            <section className="flex flex-col gap-1" aria-labelledby="today-list">
              <h2 id="today-list" className="font-display m-0 text-2xl leading-tight font-bold">
                {session.exercises.length} {session.exercises.length === 1 ? 'exercise' : 'exercises'},{' '}
                {sets} {sets === 1 ? 'set' : 'sets'}
              </h2>
              <ul className="m-0 flex list-none flex-col p-0">
                {session.exercises.map((e) => (
                  <ExerciseRow key={e.id} exercise={e} clamp />
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
