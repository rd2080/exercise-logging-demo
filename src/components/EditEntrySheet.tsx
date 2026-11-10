import { useState } from 'react'
import type { Entry } from '../entries'
import { TYPE_META } from '../lib/tracking'
import type { SetValues } from '../types'
import { AnswerSheet } from './AnswerSheet'
import { SetFields } from './SetFields'

interface EditEntrySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: Entry | null
  onSave: (id: string, values: SetValues) => void
  onDelete: (id: string) => void
}

/** Change the amounts of a logged entry, or delete it after one in-place confirmation. */
export function EditEntrySheet({ entry, ...rest }: EditEntrySheetProps) {
  if (!entry) return null
  // Keyed by entry so the steppers and the confirmation start fresh for each entry.
  return <Body key={entry.id} entry={entry} {...rest} />
}

function Body({ open, onOpenChange, entry, onSave, onDelete }: EditEntrySheetProps & { entry: Entry }) {
  const [values, setValues] = useState<SetValues>({ ...entry.values })
  const [confirming, setConfirming] = useState(false)
  const meta = TYPE_META[entry.trackingType]

  return (
    <AnswerSheet
      open={open}
      onOpenChange={(o) => {
        if (!o) setConfirming(false)
        onOpenChange(o)
      }}
      title={entry.name}
      why={meta.label}
      tape={meta.tape}
      saveLabel="Save changes"
      onSave={() => onSave(entry.id, values)}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-line p-4 max-[360px]:p-3" data-testid="edit-inputs">
          <SetFields type={entry.trackingType} values={values} onChange={(p) => setValues((v) => ({ ...v, ...p }))} />
        </div>
        {confirming ? (
          <div className="flex flex-col gap-3" data-testid="delete-confirm" role="group" aria-label="Delete this entry?">
            <p className="font-display m-0 text-2xl leading-tight font-bold">Delete this entry?</p>
            <button
              type="button"
              className="press h-14 w-full rounded-2xl bg-surface-2 text-lg font-semibold text-ink"
              onClick={() => onDelete(entry.id)}
              autoFocus
            >
              Delete entry
            </button>
            <button
              type="button"
              className="press h-14 w-full rounded-2xl bg-surface-2 text-lg font-semibold"
              onClick={() => setConfirming(false)}
            >
              Keep entry
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="press h-14 w-full rounded-2xl bg-surface-2 text-lg font-semibold"
            onClick={() => setConfirming(true)}
          >
            Delete entry
          </button>
        )}
      </div>
    </AnswerSheet>
  )
}
