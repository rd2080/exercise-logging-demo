import { ArrowLeft } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { AddExerciseSheet } from '../components/AddExerciseSheet'
import { DemoFigure } from '../components/DemoFigure'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { EntryRow } from '../components/EntryRow'
import type { Entry } from '../entries'
import { TYPE_META, targetText } from '../lib/tracking'
import type { Exercise } from '../types'

interface ExerciseDetailScreenProps {
  /** The exercise to show, or undefined when the id is not in the plan. */
  exercise: Exercise | undefined
  plan: Exercise[]
  entries: Entry[]
  onAdd: (entry: Omit<Entry, 'id'>) => void
  onBack: () => void
}

/** Sets saved for this exercise, newest first. Older entries without an id match by name and type. */
export function historyFor(exercise: Exercise, entries: Entry[]): Entry[] {
  return entries.filter((e) =>
    e.exerciseId
      ? e.exerciseId === exercise.id
      : e.trackingType === exercise.trackingType && e.name.toLowerCase() === exercise.name.toLowerCase(),
  )
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      className="press grid size-12 place-items-center rounded-full bg-surface-2"
      aria-label="Back"
      onClick={onBack}
      data-testid="detail-back"
    >
      <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

export function ExerciseDetailScreen({ exercise, plan, entries, onAdd, onBack }: ExerciseDetailScreenProps) {
  const [logging, setLogging] = useState(false)
  const shell = 'mx-auto flex min-h-dvh w-full max-w-[480px] flex-col'
  const main = 'flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-28'

  if (!exercise) {
    return (
      <div className={shell} style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties} data-testid="exercise-detail">
        <main className={main}>
          <BackButton onBack={onBack} />
          <EmptyState
            illustration={<EmptySlots />}
            title="Exercise not found"
            body="This exercise is not in your plan. Go back to your exercises to pick another."
            actionLabel="Back to exercises"
            onAction={onBack}
          />
        </main>
      </div>
    )
  }

  const meta = TYPE_META[exercise.trackingType]
  const history = historyFor(exercise, entries)
  return (
    <div className={shell} style={{ '--tape': meta.tape } as CSSProperties} data-testid="exercise-detail">
      <main className={main}>
        <BackButton onBack={onBack} />
        <DemoFigure exerciseId={exercise.id} name={exercise.name} compact />
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance [overflow-wrap:anywhere]">
            {exercise.name}
          </h1>
          <span
            className="flex w-fit max-w-full items-center gap-2 rounded-full bg-surface-2 py-1.5 pr-3.5 pl-2.5 text-[17px] font-semibold"
            data-testid="detail-type"
          >
            <span className="size-3 shrink-0 rounded-full bg-(--tape)" aria-hidden="true" />
            {meta.label}
          </span>
          <p className="m-0 text-[17px] text-muted" data-testid="detail-target">
            Target: {targetText(exercise)}
          </p>
          <p className="m-0 text-lg leading-snug text-pretty text-ink [overflow-wrap:anywhere]" data-testid="detail-cue">
            {exercise.cue}
          </p>
        </header>
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
          onClick={() => setLogging(true)}
          data-testid="log-set"
        >
          Log a set
        </button>
        <section className="flex flex-col gap-1" aria-labelledby="history-heading">
          <h2 id="history-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            Your history
          </h2>
          {history.length === 0 ? (
            <p className="m-0 py-3 text-lg text-muted" data-testid="history-empty">
              No sets logged yet
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0" data-testid="history-list">
              {history.map((e) => (
                <EntryRow key={e.id} entry={e} hideName />
              ))}
            </ul>
          )}
        </section>
      </main>
      <AddExerciseSheet
        open={logging}
        onOpenChange={setLogging}
        plan={plan}
        entries={entries}
        onAdd={onAdd}
        initialExercise={exercise}
      />
    </div>
  )
}
