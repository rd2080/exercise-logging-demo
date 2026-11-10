import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { History, X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { DemoFigure } from '../components/DemoFigure'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { SessionTape } from '../components/SessionTape'
import { SetSlots } from '../components/SetSlots'
import { SetFields } from '../components/SetFields'
import { Summary } from '../components/Summary'
import {
  SOURCE_NOTE,
  TYPE_META,
  formatClock,
  initialDraft,
  targetText,
} from '../lib/tracking'
import type { Entry } from '../entries'
import type { PrefillSource, SetValues, Session } from '../types'

type Phase =
  | { kind: 'log' }
  | { kind: 'rest'; endsAt: number; total: number }
  | { kind: 'lead'; endsAt: number }
  | { kind: 'hold'; startedAt: number; endsAt: number }
  | { kind: 'exercise-done' }

const LEAD_SECONDS = 3

/** Ticks on its own so the whole screen does not re-render every 200ms. */
function Clock({ endsAt, mode }: { endsAt: number; mode: 'clock' | 'seconds' }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [])
  const remaining = (endsAt - now) / 1000
  return <>{mode === 'clock' ? formatClock(remaining) : Math.max(1, Math.ceil(remaining))}</>
}

/** A rest bar that drains on the compositor: one linear scaleX animation, no per-frame updates. */
function RestBar({ endsAt, total }: { endsAt: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      // No animation: show the remaining fraction and update it once a second.
      const set = () => {
        const left = Math.max(0, endsAt - Date.now())
        el.style.transform = `scaleX(${Math.min(1, left / (total * 1000))})`
      }
      set()
      const id = setInterval(set, 1000)
      return () => clearInterval(id)
    }
    const remaining = Math.max(0, endsAt - Date.now())
    const from = Math.min(1, remaining / (total * 1000))
    const anim = el.animate(
      [{ transform: `scaleX(${from})` }, { transform: 'scaleX(0)' }],
      { duration: remaining, easing: 'linear', fill: 'forwards' },
    )
    return () => anim.cancel()
  }, [endsAt, total, reduce])
  return (
    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
      <div ref={ref} className="h-full origin-left rounded-full bg-(--tape)" />
    </div>
  )
}

export function PlayerScreen({
  session,
  onExit,
  onFinish,
  onLog,
}: {
  session: Session
  onExit?: () => void
  onFinish?: () => void
  onLog?: (entries: Omit<Entry, 'id'>[]) => void
}) {
  if (session.exercises.length === 0) {
    return (
      <div
        className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 pt-[max(2rem,env(safe-area-inset-top))]"
        style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
        data-testid="player-empty"
      >
        <EmptyState
          illustration={<EmptySlots />}
          title="No exercises in this workout"
          body="Choose a programme to get a plan with exercises you can log."
          actionLabel="Back to progress"
          onAction={() => onExit?.()}
        />
      </div>
    )
  }
  return <Player session={session} onFinish={onFinish} onLog={onLog} />
}

function Player({
  session,
  onFinish,
  onLog,
}: {
  session: Session
  onFinish?: () => void
  onLog?: (entries: Omit<Entry, 'id'>[]) => void
}) {
  const { exercises } = session
  const [index, setIndex] = useState(0)
  const [logs, setLogs] = useState<SetValues[][]>(() => exercises.map(() => []))
  const [draft, setDraft] = useState<SetValues>(() => initialDraft(exercises[0]).values)
  const [source, setSource] = useState<PrefillSource>(() => initialDraft(exercises[0]).source)
  const [phase, setPhase] = useState<Phase>({ kind: 'log' })
  const [finished, setFinished] = useState(false)
  const [announce, setAnnounce] = useState('')
  const [confirmEnd, setConfirmEnd] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const keepGoing = () => {
    setConfirmEnd(false)
    // The button that had focus is about to unmount: put focus back on the X.
    requestAnimationFrame(() => closeRef.current?.focus())
  }
  useEffect(() => {
    if (!confirmEnd) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') keepGoing()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmEnd])
  const saved = useRef(false)

  const ex = exercises[index]
  const meta = TYPE_META[ex.trackingType]
  const logged = logs[index]
  const next = exercises[index + 1]

  const startExercise = useCallback(
    (i: number) => {
      const d = initialDraft(exercises[i])
      setIndex(i)
      setDraft(d.values)
      setSource(d.source)
      setPhase({ kind: 'log' })
      setAnnounce(`Exercise ${i + 1} of ${exercises.length}: ${exercises[i].name}`)
    },
    [exercises],
  )

  const finishHold = useCallback((seconds: number) => {
    setDraft((d) => ({ ...d, seconds }))
    setSource('hold')
    setAnnounce(`Hold complete, ${seconds} seconds`)
    navigator.vibrate?.([30, 40, 30])
    setPhase({ kind: 'log' })
  }, [])

  useEffect(() => {
    if (phase.kind === 'log' || phase.kind === 'exercise-done') return
    const id = setTimeout(
      () => {
        if (phase.kind === 'rest') {
          setPhase({ kind: 'log' })
          setAnnounce('Rest over')
          navigator.vibrate?.(20)
        }
        else if (phase.kind === 'lead') {
          const seconds = draft.seconds ?? ex.target.seconds ?? 30
          setPhase({ kind: 'hold', startedAt: phase.endsAt, endsAt: phase.endsAt + seconds * 1000 })
          setAnnounce(`Hold started, ${seconds} seconds`)
          navigator.vibrate?.(20)
        } else finishHold(Math.round((phase.endsAt - phase.startedAt) / 1000))
      },
      Math.max(0, phase.endsAt - Date.now()),
    )
    return () => clearTimeout(id)
  }, [phase, ex, draft.seconds, finishHold])

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

  /** Ends the session and saves every logged set once, however the user leaves. */
  const finish = () => {
    if (!saved.current) {
      saved.current = true
      const list: Omit<Entry, 'id'>[] = []
      logs.forEach((sets, i) =>
        sets.forEach((values) =>
          list.push({
            name: exercises[i].name,
            trackingType: exercises[i].trackingType,
            values: { ...values },
            exerciseId: exercises[i].id,
            source: 'workout',
          }),
        ),
      )
      onLog?.(list)
    }
    setConfirmEnd(false)
    setFinished(true)
  }

  const closeWorkout = () => {
    if (logs.some((l) => l.length > 0)) setConfirmEnd(true)
    else finish()
  }

  const restart = () => {
    saved.current = false
    setLogs(exercises.map(() => []))
    setFinished(false)
    startExercise(0)
  }

  if (finished) return <Summary exercises={exercises} logs={logs} onDone={() => (onFinish ? onFinish() : restart())} />

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
          ? { label: 'Next exercise', onClick: () => startExercise(index + 1) }
          : { label: 'Finish workout', onClick: finish }
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
            ref={closeRef}
            onClick={closeWorkout}
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

      <main
        className={`flex flex-1 flex-col gap-4 px-4 short:gap-3 ${confirmEnd ? 'pb-56 short:pb-52' : 'pb-40 short:pb-32'}`}
      >
        <DemoFigure exerciseId={ex.id} name={ex.name} />

        <section className="flex flex-col gap-2.5 short:gap-1.5" aria-labelledby="exercise-name">
          <h1
            id="exercise-name"
            className="font-display m-0 line-clamp-2 text-[36px] leading-[1.05] font-bold text-balance short:text-[30px]"
            title={ex.name}
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
          <p className="m-0 line-clamp-3 max-w-[34ch] text-lg leading-snug text-ink short:text-base" data-testid="form-cue">
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
            className="flex flex-col gap-4 rounded-3xl bg-surface p-4 max-[360px]:p-3 short:gap-2 short:p-3"
            aria-label="Log this set"
            data-testid="inputs"
          >
            <SetFields type={ex.trackingType} values={draft} onChange={patch} />
            {ex.trackingType === 'time' && (
                <button
                  type="button"
                  className="press h-14 rounded-2xl bg-surface-2 text-lg font-semibold"
                  onClick={() => {
                    setPhase({ kind: 'lead', endsAt: Date.now() + LEAD_SECONDS * 1000 })
                    setAnnounce(`Get into position. The hold starts in ${LEAD_SECONDS} seconds.`)
                  }}
                >
                  Start {draft.seconds ?? 0} second hold
                </button>
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
                <Clock endsAt={phase.endsAt} mode="clock" />
              </p>
            </div>
            <RestBar endsAt={phase.endsAt} total={phase.total} />
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <p className="m-0 text-muted">
                Next: set {logged.length + 1} of {ex.sets}
              </p>
              <button
                type="button"
                className="press h-12 rounded-2xl bg-surface-2 px-4 text-lg font-semibold whitespace-nowrap"
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
              <Clock endsAt={phase.endsAt} mode={phase.kind === 'lead' ? 'seconds' : 'clock'} />
            </p>
          </section>
        )}

        {phase.kind === 'exercise-done' && (
          <section className="rounded-3xl bg-surface p-4" data-testid="exercise-done">
            <h2 className="font-display m-0 text-2xl font-semibold">All sets logged</h2>
            <p className="m-0 mt-1 line-clamp-2 text-muted">
              {next ? `Next up: ${next.name}.` : 'That was the last exercise.'}
            </p>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] short:pt-3 short:pb-3">
        {confirmEnd ? (
          <div className="flex flex-col gap-3" role="group" aria-labelledby="end-title" data-testid="end-confirm">
            <p id="end-title" className="font-display m-0 text-2xl font-semibold">
              End workout?
            </p>
            <button
              type="button"
              className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
              onClick={keepGoing}
              autoFocus
            >
              Keep going
            </button>
            <button
              type="button"
              className="press h-12 w-full rounded-2xl bg-surface-2 text-lg font-semibold"
              onClick={finish}
            >
              End workout
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
            onClick={primary.onClick}
            data-testid="primary"
          >
            {primary.label}
          </button>
        )}
      </footer>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
