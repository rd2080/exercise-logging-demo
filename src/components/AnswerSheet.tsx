import { Drawer } from 'vaul'
import type { ReactNode } from 'react'

interface AnswerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  why: string
  children: ReactNode
  /** Label of the button that saves and closes. Omit when a single tap answers. */
  saveLabel?: string
  canSave?: boolean
}

export function AnswerSheet({
  open,
  onOpenChange,
  title,
  why,
  children,
  saveLabel,
  canSave = true,
}: AnswerSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ground/80" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-surface outline-none"
          aria-describedby="sheet-why"
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <div className="flex flex-col gap-1 px-4 pt-4 pb-3">
            <Drawer.Title className="font-display m-0 text-[30px] leading-[1.1] font-bold">
              {title}
            </Drawer.Title>
            <Drawer.Description id="sheet-why" className="m-0 text-[17px] text-muted">
              {why}
            </Drawer.Description>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 [mask-image:linear-gradient(to_bottom,transparent,black_14px)]">
            {children}
          </div>
          {saveLabel && (
            <div className="border-t border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape disabled:bg-surface-2 disabled:text-muted"
                disabled={!canSave}
                onClick={() => onOpenChange(false)}
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
