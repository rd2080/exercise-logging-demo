import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

interface DisclosureProps {
  /** The heading text. */
  title: string
  /** A short muted line under the title, such as "3 moves". */
  meta?: ReactNode
  metaTestId?: string
  defaultOpen?: boolean
  children: ReactNode
  testId?: string
}

/** A section heading that is also the button that opens and closes its content. */
export function Disclosure({ title, meta, metaTestId, defaultOpen = false, children, testId }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <section className="flex flex-col" data-testid={testId}>
      <h2 className="m-0">
        <button
          type="button"
          className="press flex min-h-14 w-full items-center justify-between gap-3 text-left"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-2xl leading-tight font-bold [overflow-wrap:anywhere]">{title}</span>
            {meta && (
              <span className="text-[17px] text-pretty text-muted" data-testid={metaTestId}>
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
      </h2>
      <div id={id} hidden={!open}>
        {children}
      </div>
    </section>
  )
}
