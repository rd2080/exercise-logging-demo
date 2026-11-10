import { ChevronRight } from 'lucide-react'
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
export function EntryRow({
  entry,
  onSelect,
  hideName = false,
}: {
  entry: Entry
  onSelect?: (entry: Entry) => void
  /** On a page already about one exercise: lead with the values, not the repeated name. */
  hideName?: boolean
}) {
  const meta = TYPE_META[entry.trackingType]
  const kind = `${meta.label}${entry.source !== 'workout' ? ' · By hand' : ''}`
  const body = hideName ? (
    <>
      <Slot n={0} filled />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="num text-xl leading-tight font-bold [overflow-wrap:anywhere]">{show(entry)}</span>
        <span className="text-[17px] text-pretty text-muted">{kind}</span>
      </span>
    </>
  ) : (
    <>
      <Slot n={0} filled />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-xl leading-tight font-semibold [overflow-wrap:anywhere]">
          {entry.name}
        </span>
        <span className="text-[17px] text-pretty text-muted">{kind}</span>
      </span>
      <span className="num shrink-0 pt-0.5 text-xl font-bold whitespace-nowrap">{show(entry)}</span>
    </>
  )
  if (!onSelect) {
    return (
      <li
        className="flex min-h-[72px] items-start gap-3 border-t border-line py-3 first:border-t-0"
        aria-label={`${entry.name}: ${formatValues(entry.trackingType, entry.values)}`}
      >
        {body}
      </li>
    )
  }
  return (
    <li className="border-t border-line first:border-t-0">
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="press flex min-h-[72px] w-full items-start gap-3 py-3 text-left"
      aria-label={`${entry.name}: ${formatValues(entry.trackingType, entry.values)}. Edit entry`}
    >
      {body}
      <ChevronRight size={24} className="mt-2 shrink-0 text-muted" aria-hidden="true" />
    </button>
    </li>
  )
}
