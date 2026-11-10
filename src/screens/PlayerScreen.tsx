import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { History, X } from 'lucide-react'
import { DemoFigure } from '../components/DemoFigure'
import { SessionTape } from '../components/SessionTape'
import { SetSlots } from '../components/SetSlots'
import { Stepper } from '../components/Stepper'
import { Summary } from '../components/Summary'
import {
  SOURCE_NOTE,
  TYPE_META,
  formatClock,
  initialDraft,
  targetText,
} from '../lib/tracking'
import type { PrefillSource, SetValues, Session } from '../types'

type Phase =
  | { kind: 'log' }
  | { kind: 'rest'; endsAt: number; total: number }
  | { kind: 'lead'; endsAt: number }
  | { kind: 'hold'; startedAt: number; endsAt: number }
  | { kind: 'exercise-done' }

const LEAD_SECONDS = 3

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [active])
  return now
}

export function PlayerScreen({ session }: { session: Session }) {
  const { exercises } = session
  const [index, setIndex] = useState(0)
  const [logs, setLogs] = useState<SetValues[][]>(() => exercises.map(() => []))
  const [draft, setDraft] = useState<SetValues>(() => initialDraft(exercises[0]).values)
  const [source, setSource] = useState<PrefillSource>(() => initialDraft(exercises[0]).source)
  const [phase, setPhase] = useState<Phase>({ kind: 'log' })
  const [finished, setFinished] = useState(false)
  const [announce, setAnnounce] = useState('')

  const ex = exercises[index]
  const meta = TYPE_META[ex.trackingType]
  const logged = logs[index]
  const next = exercises[index + 1]
  const timed = phase.kind === 'rest' || phase.kind === 'lead' || phase.kind === 'hold'
  const now = useNow(timed)

  const startExercise = useCallback(
    (i: number) => {
      const d = initialDraft(exercises[i])
      setIndex(i)
      setDraft(d.values)
      setSource(d.source)
      setPhase({ kind: 'log' })
    },
    [exercises],
  )

  const finishHold = useCallback((seconds: number) => {
    setDraft((d) => ({ ...d, seconds }))
    setSource('hold')
    setPhase({ kind: 'log' })
  }, [])

  useEffect(() => {
    if (phase.kind === 'rest' && now >= phase.endsAt) setPhase({ kind: 'log' })
    if (phase.kind === 'lead' && now >= phase.endsAt) {
      const seconds = ex.target.seconds ?? 30
      setPhase({ kind: 'hold', startedAt: phase.endsAt, endsAt: phase.endsAt + (draft.seconds ?? seconds) * 1000 })
    }
    if (phase.kind === 'hold' && now >= phase.endsAt) {
      finishHold(Math.round((phase.endsAt - phase.startedAt) / 1000))
    }
  }, [now, phase, ex, draft.seconds, finishHold])

  const logSet = () => {
    const values = { ...draft }
    const nextLogs = logs.map((l, i) => (i === index ? [...l, values] : l))
    setLogs(nextLogs)
    setAnnounce(`Set ${nextLogs[index].length} of ${ex.sets} logged`)
    navigator.vibrate?.(12)
    if (nextLogs[index].length >= ex.sets) {
      setPhase({ kind: 'exercise-done' })
    } else {
      setSource('previous-set')
      setPhase({ kind: 'rest', endsAt: Date.now() + session.restSeconds * 1000, total: session.restSeconds })
    }
  }

  const endHold = () => {
    if (phase.kind === 'hold') {
      finishHold(Math.max(1, Math.round((Date.now() - phase.startedAt) / 1000)))
    } else {
      setPhase({ kind: 'log' })
    }
  }

  const restart = () => {
    setLogs(exercises.map(() => []))
    setFinished(false)
    startExercise(0)
  }

  if (finished) return <Summary exercises={exercises} logs={logs} onRestart={restart} />

  const patch = (p: SetValues) => {
    setDraft((d) => ({ ...d, ...p }))
  }

  const primary = (() => {
    switch (phase.kind) {
      case 'log':
        return { label: 'Log set', onClick: logSet }
      case 'rest':
        return { label: 'Skip rest', onClick: () => setPhase({ kind: 'log' }) }
      case 'lead':
      case 'hold':
        return { label: 'End hold', onClick: endHold }
      case 'exercise-done':
        return next
          ? { label: `Go to ${next.name.toLowerCase()}`, onClick: () => startExercise(index + 1) }
          : { label: 'Finish workout', onClick: () => setFinished(true) }
    }
  })()

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': meta.tape } as CSSProperties}
      data-testid="player"
    >
      <header className="flex flex-col gap-3 px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3.5 short:gap-2 short:pb-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="press grid size-12 place-items-center rounded-full bg-surface-2"
            aria-label="End workout"
            onClick={() => setFinished(true)}
          >
            <X size={24} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <p className="num m-0 text-lg font-semibold text-muted">
            Exercise {index + 1} of {exercises.length}
          </p>
        </div>
        <SessionTape
          exercises={exercises}
          current={index}
          loggedCounts={logs.map((l) => l.length)}
        />
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-40 short:gap-3 short:pb-32">
        <DemoFigure exerciseId={ex.id} name={ex.name} />

        <section className="flex flex-col gap-2.5 short:gap-1.5" aria-labelledby="exercise-name">
          <h1
            id="exercise-name"
            className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance short:text-[30px]"
          >
            {ex.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[17px]">
            <span className="flex items-center gap-2 rounded-full bg-surface-2 py-1.5 pr-3.5 pl-2.5 font-semibold">
              <span className="size-3 rounded-full bg-(--tape)" aria-hidden="true" />
              {meta.label}
            </span>
            <span className="text-muted">{targetText(ex)}</span>
          </div>
          <p className="m-0 max-w-[34ch] text-lg leading-snug text-ink short:text-base" data-testid="form-cue">
            {ex.cue}
          </p>
        </section>

        <section className="flex flex-col" aria-labelledby="sets-heading">
          <h2 id="sets-heading" className="sr-only">
            Sets
          </h2>
          <SetSlots exercise={ex} logged={logged} active={phase.kind !== 'exercise-done'} />
        </section>

        {phase.kind === 'log' && (
          <section
            className="flex flex-col gap-4 rounded-3xl bg-surface p-4 short:gap-2 short:p-3"
            aria-label="Log this set"
            data-testid="inputs"
          >
            {ex.trackingType === 'reps' && (
              <Stepper
                label="Reps"
                value={draft.reps ?? 0}
                min={0}
                max={99}
                step={1}
                onChange={(reps) => patch({ reps })}
              />
            )}
            {ex.trackingType === 'reps_per_side' && (
              <div className="flex gap-4">
                <Stepper
                  compact
                  label="Left"
                  value={draft.left ?? 0}
                  min={0}
                  max={99}
                  step={1}
                  onChange={(left) => patch({ left })}
                />
                <Stepper
                  compact
                  label="Right"
                  value={draft.right ?? 0}
                  min={0}
                  max={99}
                  step={1}
                  onChange={(right) => patch({ right })}
                />
              </div>
            )}
            {ex.trackingType === 'time' && (
              <>
                <Stepper
                  label="Hold time"
                  unit="s"
                  value={draft.seconds ?? 0}
                  min={5}
                  max={300}
                  step={5}
                  onChange={(seconds) => patch({ seconds })}
                />
                <button
                  type="button"
                  className="press h-14 rounded-2xl bg-surface-2 text-lg font-semibold"
                  onClick={() =>
                    setPhase({ kind: 'lead', endsAt: Date.now() + LEAD_SECONDS * 1000 })
                  }
                >
                  Start {draft.seconds ?? 0} second hold
                </button>
              </>
            )}
            {ex.trackingType === 'weight_reps' && (
              <div className="flex gap-4">
                <Stepper
                  compact
                  label="Weight"
                  unit="kg"
                  value={draft.kg ?? 0}
                  min={0}
                  max={300}
                  step={2.5}
                  onChange={(kg) => patch({ kg })}
                />
                <Stepper
                  compact
                  label="Reps"
                  value={draft.reps ?? 0}
                  min={0}
                  max={99}
                  step={1}
                  onChange={(reps) => patch({ reps })}
                />
              </div>
            )}
            <p className="m-0 flex items-center gap-2 text-[15px] text-muted" data-testid="prefill-note">
              <History size={18} aria-hidden="true" />
              {SOURCE_NOTE[source]}
            </p>
          </section>
        )}

        {phase.kind === 'rest' && (
          <section
            className="flex flex-col gap-4 rounded-3xl bg-surface p-4"
            aria-label="Rest"
            data-testid="rest"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display m-0 text-2xl font-semibold">Rest</h2>
              <p className="num m-0 text-[44px] leading-none font-bold" data-testid="timer">
                {formatClock((phase.endsAt - now) / 1000)}
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-(--tape)"
                style={{
                  width: `${Math.max(0, Math.min(100, ((phase.endsAt - now) / (phase.total * 10)) ))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="m-0 text-muted">
                Next: set {logged.length + 1} of {ex.sets}
              </p>
              <button
                type="button"
                className="press h-12 rounded-2xl bg-surface-2 px-4 text-lg font-semibold"
                onClick={() =>
                  setPhase({ ...phase, endsAt: phase.endsAt + 15000, total: phase.total + 15 })
                }
              >
                Add 15 seconds
              </button>
            </div>
          </section>
        )}

        {(phase.kind === 'lead' || phase.kind === 'hold') && (
          <section
            className="flex flex-col gap-3 rounded-3xl bg-surface p-4"
            aria-label="Timed hold"
            data-testid="hold"
          >
            <h2 className="font-display m-0 text-2xl font-semibold">
              {phase.kind === 'lead' ? 'Get into position' : 'Hold'}
            </h2>
            <p className="num m-0 text-[72px] leading-none font-bold" data-testid="timer">
              {phase.kind === 'lead'
                ? Math.max(1, Math.ceil((phase.endsAt - now) / 1000))
                : formatClock((phase.endsAt - now) / 1000)}
            </p>
          </section>
        )}

        {phase.kind === 'exercise-done' && (
          <section className="rounded-3xl bg-surface p-4" data-testid="exercise-done">
            <h2 className="font-display m-0 text-2xl font-semibold">All sets logged</h2>
            <p className="m-0 mt-1 text-muted">
              {next ? `Next up: ${next.name}.` : 'That was the last exercise.'}
            </p>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] short:pt-3 short:pb-3">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
          onClick={primary.onClick}
          data-testid="primary"
        >
          {primary.label}
        </button>
      </footer>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
