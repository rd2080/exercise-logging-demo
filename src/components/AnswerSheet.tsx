import { Drawer } from 'vaul'
import type { ReactNode } from 'react'

interface AnswerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  why: string
  /** An optional plain line between the title and the reason. Use it only where it adds meaning. */
  lead?: string
  children: ReactNode
  /** Label of the button that saves and closes. Omit when a single tap answers. */
  saveLabel?: string
  canSave?: boolean
  /** Hide the lead and reason on short screens (a phone with its keyboard open) so the fields stay visible. They stay for screen readers. */
  compactWhenShort?: boolean
  /** An action shown at the right of the title row, outside the scrolling area (for example Reset). */
  headerAction?: ReactNode
  /** Tape colour for the pinned button, focus ring and anything else inside the sheet. */
  tape?: string
  /** Runs when the save button is tapped. */
  onSave?: () => void
  /** Close the sheet after saving. Set false when the button moves to a next step. */
  closeOnSave?: boolean
}

export function AnswerSheet({
  open,
  onOpenChange,
  title,
  why,
  lead,
  compactWhenShort = false,
  children,
  saveLabel,
  canSave = true,
  headerAction,
  tape,
  onSave,
  closeOnSave = true,
}: AnswerSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ground/80" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-surface outline-none"
          aria-describedby="sheet-why"
          style={tape ? ({ '--tape': tape } as React.CSSProperties) : undefined}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <div className="flex flex-col gap-1 px-4 pt-4 pb-3">
            <div className="flex items-start justify-between gap-3">
              <Drawer.Title
              id="sheet-title"
              tabIndex={-1}
              className="font-display m-0 text-[30px] leading-[1.1] font-bold outline-none [overflow-wrap:anywhere]"
            >
              {title}
            </Drawer.Title>
              {headerAction}
            </div>
            {lead && (
              <p className={`m-0 text-xl font-semibold text-pretty ${compactWhenShort ? 'short:sr-only' : ''}`} data-testid="sheet-lead">
                {lead}
              </p>
            )}
            <Drawer.Description id="sheet-why" className={`m-0 text-[17px] text-pretty text-muted ${compactWhenShort ? 'short:sr-only' : ''}`}>
              {why}
            </Drawer.Description>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 [mask-image:linear-gradient(to_bottom,transparent,black_28px)]">
            {children}
          </div>
          {saveLabel && (
            <div className="border-t border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape disabled:bg-surface-2 disabled:text-muted"
                disabled={!canSave}
                onClick={() => {
                  onSave?.()
                  if (closeOnSave) onOpenChange(false)
                }}
              >
                {saveLabel}
              </button>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
