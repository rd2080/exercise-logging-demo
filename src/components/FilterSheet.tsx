import type { EquipmentId, LevelId, TrackingType } from '../types'
import { EQUIPMENT_LABELS, LEVEL_LABELS, NO_FILTERS, activeFilterCount, type Filters } from '../lib/library'
import { TYPE_META } from '../lib/tracking'
import { AnswerSheet } from './AnswerSheet'

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Filters
  onChange: (next: Filters) => void
  /** How many exercises the current filters leave. Shown in the pinned button. */
  count: number
}

const TYPES = Object.keys(TYPE_META) as TrackingType[]
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
      why="Within a group any choice counts. A choice in each group narrows the list."
      saveLabel={count === 0 ? 'No exercises match' : `Show ${count} ${count === 1 ? 'exercise' : 'exercises'}`}
      canSave={count > 0}
    >
      <div className="flex flex-col">
        <div className="flex justify-end">
          <button
            type="button"
            disabled={active === 0}
            onClick={() => onChange({ ...NO_FILTERS, query: filters.query })}
            className="press h-12 rounded-full px-4 text-lg font-semibold text-ink disabled:text-muted"
          >
            Reset
          </button>
        </div>
        <Group title="How it is counted">
          {TYPES.map((t) => (
            <Chip
              key={t}
              label={TYPE_META[t].label}
              on={filters.types.includes(t)}
              onClick={() => onChange({ ...filters, types: toggle(filters.types, t) })}
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
