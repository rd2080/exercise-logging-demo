import { Drawer } from 'vaul'
import type { CSSProperties } from 'react'

interface ConfirmSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  why: string
  /** Names the result, in sentence case ("Switch to stage 2"). */
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  tape?: string
  testId?: string
}

/** A short question over the page with two buttons: back out, or do the thing. */
export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  why,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  tape,
  testId,
}: ConfirmSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ground/80" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] flex-col rounded-t-3xl bg-surface outline-none"
          aria-describedby="confirm-why"
          style={tape ? ({ '--tape': tape } as CSSProperties) : undefined}
          data-testid={testId}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
            <Drawer.Title tabIndex={-1} className="font-display m-0 text-[30px] leading-[1.1] font-bold outline-none [overflow-wrap:anywhere]">
              {title}
            </Drawer.Title>
            <Drawer.Description id="confirm-why" className="m-0 text-[17px] text-pretty text-muted">
              {why}
            </Drawer.Description>
          </div>
          <div className="flex flex-col gap-3 border-t border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              data-testid="confirm-yes"
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              className="press h-14 w-full rounded-full text-xl font-semibold"
              onClick={() => onOpenChange(false)}
              data-testid="confirm-cancel"
            >
              {cancelLabel}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
