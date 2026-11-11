import type { CategoryId, EquipmentId, LevelId } from '../types'
import { CATEGORY_LABELS, EQUIPMENT_LABELS, LEVEL_LABELS, NO_FILTERS, activeFilterCount, type Filters } from '../lib/library'
import { AnswerSheet } from './AnswerSheet'

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Filters
  onChange: (next: Filters) => void
  /** How many exercises the current filters leave. Shown in the pinned button. */
  count: number
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as CategoryId[]
const EQUIPMENT = Object.keys(EQUIPMENT_LABELS) as EquipmentId[]
const LEVELS = Object.keys(LEVEL_LABELS) as LevelId[]

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`press h-12 rounded-full px-4 text-lg font-semibold ${
        on ? 'bg-ink text-on-tape' : 'border-2 border-line text-ink'
      }`}
    >
      {label}
    </button>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={title} className="flex flex-col gap-3 border-t border-line py-4 first:border-t-0">
      <h3 className="font-display m-0 text-xl font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

/** Chip groups for type, equipment and level, with a live result count in the pinned button. */
export function FilterSheet({ open, onOpenChange, filters, onChange, count }: FilterSheetProps) {
  const active = activeFilterCount(filters)
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      compactWhenShort
      why="Within a group any choice counts. A choice in each group narrows the list."
      saveLabel={count === 0 ? 'No exercises match' : `Show ${count} ${count === 1 ? 'exercise' : 'exercises'}`}
      canSave={count > 0}
      headerAction={
        <button
          type="button"
          disabled={active === 0}
          onClick={() => {
            onChange({ ...NO_FILTERS, query: filters.query })
            // The button disables itself once nothing is set, so move focus somewhere that stays.
            document.getElementById('sheet-title')?.focus()
          }}
          className="press h-12 shrink-0 rounded-full bg-surface-2 px-4 text-lg font-semibold text-ink disabled:bg-transparent disabled:text-muted disabled:opacity-60"
        >
          Reset
        </button>
      }
    >
      <p className="sr-only" role="status">
        {count === 0 ? 'No exercises match' : `${count} ${count === 1 ? 'exercise matches' : 'exercises match'}`}
      </p>
      <div className="flex flex-col">
        <Group title="Saved">
          <Chip label="Saved only" on={filters.saved} onClick={() => onChange({ ...filters, saved: !filters.saved })} />
        </Group>
        <Group title="Category">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={CATEGORY_LABELS[c]}
              on={filters.categories.includes(c)}
              onClick={() => onChange({ ...filters, categories: toggle(filters.categories, c) })}
            />
          ))}
        </Group>
        <Group title="Equipment">
          {EQUIPMENT.map((e) => (
            <Chip
              key={e}
              label={EQUIPMENT_LABELS[e]}
              on={filters.equipment.includes(e)}
              onClick={() => onChange({ ...filters, equipment: toggle(filters.equipment, e) })}
            />
          ))}
        </Group>
        <Group title="Level">
          {LEVELS.map((l) => (
            <Chip
              key={l}
              label={LEVEL_LABELS[l]}
              on={filters.levels.includes(l)}
              onClick={() => onChange({ ...filters, levels: toggle(filters.levels, l) })}
            />
          ))}
        </Group>
      </div>
    </AnswerSheet>
  )
}
