import { X } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { formatClock } from '../lib/tracking'
import type { Routine } from '../types'

interface RoutineScreenProps {
  /** "Warm-up" or "Cool-down". */
  title: string
  items: Routine[]
  /** All moves were gone through. */
  onFinish: () => void
  /** The person left early. Nothing is marked done. */
  onExit: () => void
}

type Phase = { kind: 'idle' } | { kind: 'running'; endsAt: number } | { kind: 'timed-done' }

function Countdown({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [])
  return <>{formatClock((endsAt - now) / 1000)}</>
}

/**
 * Warm-up or cool-down, one move at a time. Moves counted in reps have no timer; timed ones count
 * down. Nothing is logged: finishing the last move marks the whole routine done for the day.
 */
export function RoutineScreen({ title, items, onFinish, onExit }: RoutineScreenProps) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announce, setAnnounce] = useState(`${title}. Move 1 of ${items.length}: ${items[0]?.name ?? ''}.`)
  const move = items[index]
  const last = index === items.length - 1

  useEffect(() => {
    if (phase.kind !== 'running') return
    const id = setTimeout(() => {
      setPhase({ kind: 'timed-done' })
      setAnnounce('Time is up.')
      navigator.vibrate?.([30, 40, 30])
    }, Math.max(0, phase.endsAt - Date.now()))
    return () => clearTimeout(id)
  }, [phase])

  if (!move) return null

  const next = () => {
    if (last) {
      onFinish()
      return
    }
    setIndex(index + 1)
    setPhase({ kind: 'idle' })
    setAnnounce(`Move ${index + 2} of ${items.length}: ${items[index + 1].name}.`)
  }
  const doneLabel = last ? `Finish ${title.toLowerCase()}` : 'Next move'
  const primary =
    move.seconds && phase.kind === 'idle'
      ? {
          label: `Start ${move.seconds} seconds`,
          run: () => {
            setPhase({ kind: 'running', endsAt: Date.now() + move.seconds! * 1000 })
            setAnnounce(`${move.seconds} seconds, go.`)
          },
        }
      : { label: doneLabel, run: next }

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-time)' } as CSSProperties}
      data-testid="routine"
    >
      <header className="flex items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3.5">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label={`Leave ${title.toLowerCase()}`}
          onClick={onExit}
          data-testid="routine-exit"
        >
          <X size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <p className="num m-0 text-lg font-semibold text-muted">
          {title} · Move {index + 1} of {items.length}
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-40">
        <h1
          className="font-display m-0 text-[44px] leading-[1.05] font-bold text-balance [overflow-wrap:anywhere]"
          data-testid="routine-move"
        >
          {move.name}
        </h1>
        <p className="num m-0 text-2xl font-semibold text-muted" data-testid="routine-amount">
          {move.detail}
        </p>
        {move.seconds ? (
          <section className="flex flex-col gap-2 rounded-3xl bg-surface p-4" aria-label="Timer" data-testid="routine-timer">
            <p className="num m-0 text-[72px] leading-none font-bold">
              {phase.kind === 'running' ? <Countdown endsAt={phase.endsAt} /> : phase.kind === 'timed-done' ? '0:00' : formatClock(move.seconds)}
            </p>
          </section>
        ) : null}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
          onClick={primary.run}
          data-testid="routine-primary"
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
