import type { CSSProperties } from 'react'

/**
 * Shown for the moment a screen's code is still loading. Flat hairline rows in the shape of the
 * real lists: a title bar and a line, then rows with a slanted slot and two lines. The pulse stops
 * when reduced motion is on.
 */
export function ScreenSkeleton() {
  const bar = 'rounded-full bg-surface-2'
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)', '--cut': '6px' } as CSSProperties}
      role="status"
      aria-label="Loading"
      data-testid="skeleton"
    >
      <span className="sr-only">Loading</span>
      <div className="flex flex-1 animate-pulse flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28 motion-reduce:animate-none">
        <div className="flex flex-col gap-3">
          <div className={`${bar} h-10 w-2/5`} />
          <div className={`${bar} h-5 w-3/5`} />
        </div>
        <ul className="m-0 flex list-none flex-col p-0" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="flex min-h-[72px] items-start gap-3 border-t border-line py-3 first:border-t-0">
              <span className="tape-cut mt-1 h-11 w-3 shrink-0 bg-surface-2" />
              <span className="flex flex-1 flex-col gap-2 pt-1">
                <span className={`${bar} h-5 w-1/2`} />
                <span className={`${bar} h-4 w-3/4`} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
