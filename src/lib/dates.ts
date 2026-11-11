import type { Entry } from '../entries'
import { addDays, startOfDay } from './weeks'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Today", "Yesterday", or "Mon 9 Nov" (with the year when it is not this year). */
export function dayLabel(day: number, now: number): string {
  const today = startOfDay(now)
  if (day === today) return 'Today'
  if (day === addDays(today, -1)) return 'Yesterday'
  const d = new Date(day)
  const year = d.getFullYear() === new Date(now).getFullYear() ? '' : ` ${d.getFullYear()}`
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}${year}`
}

export interface DayGroup {
  /** Start of the day, or null for saved sets that carry no date. */
  day: number | null
  label: string
  entries: Entry[]
}

/** Entries grouped by the day they were logged, newest day first, newest set first within a day. */
export function groupByDay(entries: Entry[], now: number): DayGroup[] {
  const byDay = new Map<number, Entry[]>()
  const undated: Entry[] = []
  for (const e of entries) {
    if (typeof e.at !== 'number') {
      undated.push(e)
      continue
    }
    const day = startOfDay(e.at)
    byDay.set(day, [...(byDay.get(day) ?? []), e])
  }
  const groups: DayGroup[] = [...byDay.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([day, list]) => ({
      day,
      label: dayLabel(day, now),
      entries: [...list].sort((a, b) => (b.at ?? 0) - (a.at ?? 0)),
    }))
  if (undated.length > 0) groups.push({ day: null, label: 'Earlier', entries: undated })
  return groups
}
