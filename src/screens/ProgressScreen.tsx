import { Plus } from 'lucide-react'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { useState, type CSSProperties } from 'react'
import { AddExerciseSheet } from '../components/AddExerciseSheet'
import { EditEntrySheet } from '../components/EditEntrySheet'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { EntryRow } from '../components/EntryRow'
import { GoalList, type Goal } from '../components/GoalList'
import { goalsData as goalData } from '../data/fixtures'
import type { Entry } from '../entries'
import type { Exercise, SetValues } from '../types'

interface ProgressScreenProps {
  onStart: () => void
  plan: Exercise[]
  entries: Entry[]
  /** True when the browser refused to save the entries. */
  saveFailed?: boolean
  onAdd: (entry: Omit<Entry, 'id'>) => void
  onUpdate: (id: string, values: SetValues) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export function ProgressScreen({
  onStart,
  plan,
  entries,
  saveFailed,
  onAdd,
  onUpdate,
  onDelete,
  onClear,
}: ProgressScreenProps) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)
  const [clearing, setClearing] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const progress = {
    ...(goalData.progress as Record<string, number>),
    'first-set': Math.max(
      (goalData.progress as Record<string, number>)['first-set'] ?? 0,
      entries.length > 0 ? 1 : 0,
    ),
  }
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="progress"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Progress</h1>
          <button
            type="button"
            className="press grid size-12 shrink-0 place-items-center rounded-full bg-surface-2"
            aria-label="Log an exercise"
            onClick={() => setAdding(true)}
            data-testid="add-exercise"
          >
            <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="Your sets will be logged here"
            body="Log a set in any workout. It shows up here with what you did, next to what you did last time."
            actionLabel="Start your first workout"
            onAction={onStart}
            secondaryLabel="Log an exercise"
            onSecondary={() => setAdding(true)}
          />
        ) : (
          <section className="flex flex-col gap-1" aria-labelledby="logged-heading">
            <h2 id="logged-heading" className="font-display m-0 text-2xl leading-tight font-bold">
              Logged sets
            </h2>
            <ul className="m-0 flex list-none flex-col p-0" data-testid="entry-list">
              {entries.map((e) => (
                <EntryRow key={e.id} entry={e} onSelect={(en) => { setEditing(en); setEditOpen(true) }} />
              ))}
            </ul>
          </section>
        )}

        {saveFailed && entries.length > 0 && (
          <p className="m-0 text-[15px] text-muted" role="status" data-testid="save-failed">
            Not saved on this device. Your entries will be lost when you close this page.
          </p>
        )}

        <section className="flex flex-col gap-1" aria-labelledby="goals-heading">
          <h2 id="goals-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            Goals to unlock
          </h2>
          <GoalList goals={goalData.goals as Goal[]} progress={progress} />
        </section>

        {entries.length > 0 && (
          <>
            <button
              type="button"
              className="press h-14 w-full rounded-full text-xl font-semibold"
              onClick={() => setClearing(true)}
              data-testid="clear-entries"
            >
              Clear all entries
            </button>
            <ConfirmSheet
              open={clearing}
              onOpenChange={setClearing}
              title="Clear all entries?"
              why={`All ${entries.length} logged ${entries.length === 1 ? 'set' : 'sets'} on this device are deleted, and this cannot be undone.`}
              confirmLabel="Clear all entries"
              onConfirm={onClear}
              testId="clear-confirm"
            />
          </>
        )}
      </main>

      <AddExerciseSheet
        open={adding}
        onOpenChange={setAdding}
        plan={plan}
        entries={entries}
        onAdd={onAdd}
      />
      <EditEntrySheet
        open={editOpen}
        onOpenChange={setEditOpen}
        entry={editing}
        onSave={onUpdate}
        onDelete={(id) => {
          setEditOpen(false)
          onDelete(id)
        }}
      />
    </div>
  )
}
