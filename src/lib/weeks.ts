/** Calendar helpers. Weeks start on Monday and everything uses the local time zone. */

const MS_DAY = 24 * 60 * 60 * 1000

export function startOfDay(ts: number): number {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Adds whole days without being thrown by daylight saving changes. */
export function addDays(ts: number, n: number): number {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime()
}

/** 0 for Monday up to 6 for Sunday. */
export function dayIndex(ts: number): number {
  return (new Date(ts).getDay() + 6) % 7
}

export function mondayOf(ts: number): number {
  return addDays(startOfDay(ts), -dayIndex(ts))
}

/** Whole weeks from the Monday of `from` to the Monday of `to`. */
export function weeksBetween(from: number, to: number): number {
  return Math.round((mondayOf(to) - mondayOf(from)) / (7 * MS_DAY))
}

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const DAY_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
