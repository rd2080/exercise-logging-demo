import { EQUIPMENT_LABELS } from './library'
import type { Session } from '../types'

const WORK_SECONDS_PER_SET = 45

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export interface SessionFacts {
  /** A rough length: about 45 seconds of work per set plus the rest between sets. */
  minutes: number
  muscles: string[]
  /** What the session needs, or "No equipment". */
  equipment: string
}

export function sessionFacts(session: Session): SessionFacts {
  const sets = session.exercises.reduce((n, e) => n + e.sets, 0)
  const minutes = Math.max(1, Math.round((sets * (WORK_SECONDS_PER_SET + session.restSeconds)) / 60))
  const muscles: string[] = []
  const gear: string[] = []
  for (const e of session.exercises) {
    for (const m of e.muscles ?? []) if (!muscles.includes(m)) muscles.push(m)
    if (e.equipment && e.equipment !== 'none') {
      const label = EQUIPMENT_LABELS[e.equipment].toLowerCase()
      if (!gear.includes(label)) gear.push(label)
    }
  }
  return { minutes, muscles, equipment: gear.length ? `Needs ${joinList(gear)}` : 'No equipment' }
}

export { joinList }
