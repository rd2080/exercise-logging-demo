import { ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { ExerciseRow } from '../components/ExerciseRow'
import { joinList, sessionFacts } from '../lib/sessionFacts'
import { Disclosure } from '../components/Disclosure'
import type { Routine, Session } from '../types'

function RoutineList({ items }: { items: Routine[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {items.map((r) => (
        <li key={r.id} className="flex min-h-14 items-baseline justify-between gap-3 border-t border-line py-3 first:border-t-0">
          <span className="line-clamp-2 min-w-0 text-xl font-semibold [overflow-wrap:anywhere]" title={r.name}>{r.name}</span>
          <span className="num shrink-0 text-[17px] whitespace-nowrap text-muted">{r.detail}</span>
        </li>
      ))}
    </ul>
  )
}

interface TodayScreenProps {
  session: Session
  onStart: () => void
  onChoose: () => void
  onOpen: (id: string) => void
  /** The chosen programme, or null when none is chosen yet. */
  programme: { name: string; status: string } | null
  onProgramme: () => void
}

export function TodayScreen({ session, onStart, onChoose, onOpen, programme, onProgramme }: TodayScreenProps) {
  const facts = sessionFacts(session)
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
        <button
          type="button"
          onClick={onProgramme}
          className="press -my-2 flex min-h-[72px] w-full items-center gap-3 border-y border-line py-3 text-left"
          data-testid="programme-row"
        >
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-display line-clamp-2 text-xl leading-tight font-semibold [overflow-wrap:anywhere]">
              {programme ? programme.name : 'Choose a programme'}
            </span>
            <span className="text-[17px] text-pretty text-muted">
              {programme ? programme.status : 'Weeks, stages and training days'}
            </span>
          </span>
          <ChevronRight size={24} className="shrink-0 text-muted" aria-hidden="true" />
        </button>
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
            <div className="flex flex-col gap-2">
              {session.warmup && session.warmup.length > 0 && (
                <Disclosure
                  title="Warm-up"
                  meta={`${session.warmup.length} moves, not logged`}
                  testId="warmup"
                >
                  <RoutineList items={session.warmup} />
                </Disclosure>
              )}
              <Disclosure
                title={`${session.exercises.length} ${session.exercises.length === 1 ? 'exercise' : 'exercises'}, ${sets} ${sets === 1 ? 'set' : 'sets'}`}
                meta={
                  <>
                    About <span className="num">{facts.minutes}</span> min
                    {facts.muscles.length > 0 && ` · Works ${joinList(facts.muscles.slice(0, 4))}`}
                    {` · ${facts.equipment}`}
                  </>
                }
                metaTestId="session-facts"
                defaultOpen
                testId="workout"
              >
                <ul className="m-0 flex list-none flex-col p-0">
                  {session.exercises.map((e) => (
                    <ExerciseRow key={e.id} exercise={e} clamp onOpen={onOpen} />
                  ))}
                </ul>
              </Disclosure>
              {session.cooldown && session.cooldown.length > 0 && (
                <Disclosure
                  title="Cool-down"
                  meta={`${session.cooldown.length} moves, not logged`}
                  testId="cooldown"
                >
                  <RoutineList items={session.cooldown} />
                </Disclosure>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
