import { useEffect, useRef } from 'react'
import type { Exercise, SetValues } from '../types'
import { SUMMARY_MIN, TYPE_META, formatValues } from '../lib/tracking'

interface SummaryProps {
  exercises: Exercise[]
  logs: SetValues[][]
  onDone: () => void
}

export function Summary({ exercises, logs, onDone }: SummaryProps) {
  const total = logs.reduce((n, l) => n + l.length, 0)
  const done = logs.filter((l) => l.length > 0).length
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col" data-testid="summary">
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-40">
        <div className="flex flex-col gap-2">
          <h1
            ref={heading}
            tabIndex={-1}
            className="font-display m-0 text-[40px] leading-[1.05] font-bold text-balance outline-none"
          >
            {total > 0 ? 'Workout logged' : 'No sets logged'}
          </h1>
          <p className="m-0 text-lg text-muted">
            {total} {total === 1 ? 'set' : 'sets'} across {done} {done === 1 ? 'exercise' : 'exercises'}.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {exercises.map((ex, i) => {
            const meta = TYPE_META[ex.trackingType]
            return (
              <li
                key={ex.id}
                className="flex flex-col gap-3 border-t border-line py-4"
                style={{ '--tape': meta.tape } as React.CSSProperties}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display m-0 line-clamp-2 min-w-0 text-2xl font-semibold" title={ex.name}>
                    {ex.name}
                  </h2>
                  <span className="num shrink-0 text-[17px] whitespace-nowrap text-muted">
                    {logs[i].length} of {ex.sets}
                  </span>
                </div>
                <ol
                  className="m-0 grid list-none gap-1 p-0"
                  style={
                    {
                      '--cut': '10px',
                      gridTemplateColumns: `repeat(auto-fit, minmax(${SUMMARY_MIN[ex.trackingType]}, 1fr))`,
                    } as React.CSSProperties
                  }
                  aria-label={`${ex.name} sets`}
                >
                  {Array.from({ length: ex.sets }, (_, j) => {
                    const v = logs[i][j]
                    return v ? (
                      <li
                        key={j}
                        className="tape-fill tape-cut num flex h-12 min-w-0 items-center justify-center px-3 text-lg font-bold whitespace-nowrap text-on-tape"
                      >
                        {formatValues(ex.trackingType, v)}
                      </li>
                    ) : (
                      <li
                        key={j}
                        className="tape-cut num flex h-12 min-w-0 items-center justify-center bg-surface-2 text-lg font-semibold text-muted"
                        aria-label={`Set ${j + 1}: not logged`}
                      >
                        {j + 1}
                      </li>
                    )
                  })}
                </ol>
              </li>
            )
          })}
        </ul>
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-ink text-xl font-bold text-on-tape"
          onClick={onDone}
        >
          Back to today
        </button>
      </footer>
    </div>
  )
}
