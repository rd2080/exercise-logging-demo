import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

interface DisclosureProps {
  /** The heading text. */
  title: string
  /** A short muted line under the title, such as "3 moves". */
  meta?: ReactNode
  metaTestId?: string
  /** Always visible under the heading, even when the section is closed (for example a Start button). */
  action?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
  testId?: string
  /** Heading level of the title. 2 by default; 3 when the section sits under another heading. */
  level?: 2 | 3
}

/** A section heading that is also the button that opens and closes its content. */
export function Disclosure({ title, meta, metaTestId, action, defaultOpen = false, children, testId, level = 2 }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const metaId = `${id}-meta`
  const Heading = level === 3 ? 'h3' : 'h2'
  return (
    <section className="flex flex-col border-t border-line first:border-t-0" data-testid={testId}>
      <Heading className="m-0">
        <button
          type="button"
          className="press flex min-h-14 w-full items-center justify-between gap-3 text-left"
          aria-expanded={open}
          aria-controls={id}
          aria-describedby={meta ? metaId : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-2xl leading-tight font-bold [overflow-wrap:anywhere]">{title}</span>
            {meta && (
              <span id={metaId} aria-hidden="true" className="text-[17px] text-pretty text-muted" data-testid={metaTestId}>
                {meta}
              </span>
            )}
          </span>
          <ChevronDown
            size={24}
            aria-hidden="true"
            className={`shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </Heading>
      {action && <div className="py-2">{action}</div>}
      <div id={id} hidden={!open}>
        {children}
      </div>
    </section>
  )
}
