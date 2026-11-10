import type { CSSProperties } from 'react'

interface RemindersScreenProps {
  onDone: () => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TRAINING = new Set(['Mon', 'Wed', 'Fri'])

export function RemindersScreen({ onDone }: RemindersScreenProps) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="reminders"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-56 short:pt-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance">
            Get reminders on your training days?
          </h1>
          <p className="m-0 max-w-[34ch] text-lg text-muted">
            We will nudge you on the three days below. You can change this any time.
          </p>
        </header>
        <ol className="m-0 flex list-none gap-1 p-0" style={{ '--cut': '6px' } as CSSProperties} aria-label="Training days">
          {DAYS.map((d) => (
            <li
              key={d}
              className={`tape-cut grid h-14 flex-1 place-items-center text-[15px] font-semibold ${TRAINING.has(d) ? 'tape-fill text-on-tape' : 'bg-surface-2 text-muted'}`}
              aria-label={`${d}${TRAINING.has(d) ? ', training day' : ', rest day'}`}
            >
              {d}
            </li>
          ))}
        </ol>
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] flex-col gap-2 border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
          onClick={onDone}
          data-testid="turn-on-reminders"
        >
          Turn on reminders
        </button>
        <button
          type="button"
          className="press h-14 w-full rounded-full text-xl font-semibold"
          onClick={onDone}
        >
          Not now
        </button>
      </footer>
    </div>
  )
}
