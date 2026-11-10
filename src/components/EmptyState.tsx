import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** Authored illustration, decorative. */
  illustration: ReactNode
  title: string
  /** Says where the data will appear and what it will show. */
  body: string
  /** Names the result of the one main action. */
  actionLabel: string
  onAction: () => void
}

/** Template for any page with nothing to show yet: picture, headline, where it will appear, one action. */
export function EmptyState({ illustration, title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="empty-title" data-testid="empty-state">
      <div aria-hidden="true">{illustration}</div>
      <div className="flex flex-col gap-2">
        <h2 id="empty-title" className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance">
          {title}
        </h2>
        <p className="m-0 max-w-[34ch] text-lg text-pretty text-muted">{body}</p>
      </div>
      <button
        type="button"
        className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
        onClick={onAction}
        data-testid="empty-action"
      >
        {actionLabel}
      </button>
    </section>
  )
}
