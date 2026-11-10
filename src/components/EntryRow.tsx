import { Slot } from './Slot'
import type { Entry } from '../entries'
import { TYPE_META, formatValues } from '../lib/tracking'

/** Entry values with the sides labelled, so 8 and 8 read as left and right. */
function show(entry: Entry): string {
  const v = entry.values
  return entry.trackingType === 'reps_per_side'
    ? `L ${v.left ?? 0} · R ${v.right ?? 0}`
    : formatValues(entry.trackingType, v)
}

/** One logged-by-hand set: a tape slot, the exercise, the values and where it came from. */
export function EntryRow({ entry, onSelect }: { entry: Entry; onSelect: (entry: Entry) => void }) {
  const meta = TYPE_META[entry.trackingType]
  return (
    <li className="border-t border-line first:border-t-0">
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="press flex min-h-[72px] w-full items-start gap-3 py-3 text-left"
      aria-label={`${entry.name}: ${formatValues(entry.trackingType, entry.values)}. Edit entry`}
    >
      <Slot n={0} filled />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-xl leading-tight font-semibold [overflow-wrap:anywhere]">
          {entry.name}
        </span>
        <span className="text-[17px] text-pretty text-muted">
          {meta.label}
          {entry.source !== 'workout' && ' · By hand'}
        </span>
      </span>
      <span className="num shrink-0 pt-0.5 text-xl font-bold whitespace-nowrap">
        {show(entry)}
      </span>
    </button>
    </li>
  )
}
