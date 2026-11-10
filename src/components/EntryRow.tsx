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
export function EntryRow({ entry }: { entry: Entry }) {
  const meta = TYPE_META[entry.trackingType]
  return (
    <li
      className="flex min-h-[72px] items-start gap-3 border-t border-line py-3 first:border-t-0"
      aria-label={`${entry.name}: ${formatValues(entry.trackingType, entry.values)}`}
    >
      <Slot n={0} filled />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-xl leading-tight font-semibold [overflow-wrap:anywhere]">
          {entry.name}
        </span>
        <span className="text-[17px] text-pretty text-muted">
          {meta.label}
        </span>
      </span>
      <span className="num shrink-0 pt-0.5 text-xl font-bold whitespace-nowrap">
        {show(entry)}
      </span>
    </li>
  )
}
