import type { Entry } from '../entries'
import { PROGRAMMES, type Programme } from '../onboarding'
import { isTimestamp } from './storage'
import { addDays, dayIndex, mondayOf, startOfDay, weeksBetween } from './weeks'

/** The programme the user chose and when they started it. Saved in this browser only. */
export interface Chosen {
  id: string
  startedAt: number
}

export const PROGRAMME_KEY = 'exercise-demo:programme'

export function loadChosen(): Chosen | null {
  try {
    const raw = window.localStorage.getItem(PROGRAMME_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { v?: number; id?: unknown; startedAt?: unknown }
    if (data?.v !== 1 || typeof data.id !== 'string' || data.id.length > 40 || !isTimestamp(data.startedAt)) return null
    return { id: data.id, startedAt: data.startedAt }
  } catch {
    return null
  }
}

export function saveChosen(c: Chosen): boolean {
  try {
    window.localStorage.setItem(PROGRAMME_KEY, JSON.stringify({ v: 1, ...c }))
    return true
  } catch {
    return false
  }
}

export function programmeById(id: string | undefined): Programme | undefined {
  return PROGRAMMES.find((p) => p.id === id)
}

/** Which weekdays (0 = Monday) the programme plans a session on. */
export function plannedDays(perWeek: number): boolean[] {
  const table: Record<number, number[]> = {
    1: [2],
    2: [1, 4],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  }
  const days = table[Math.min(7, Math.max(1, perWeek))]
  return Array.from({ length: 7 }, (_, i) => days.includes(i))
}

export interface StageProgress {
  name: string
  focus: string
  weeks: number
  firstWeek: number
  lastWeek: number
  size: number
  done: number
  current: boolean
}

export interface ProgrammeProgress {
  week: number
  weeks: number
  finished: boolean
  sessionsDone: number
  sessionsTotal: number
  stages: StageProgress[]
  planned: boolean[]
  done: boolean[]
  today: number
  sessionsThisWeek: number
  plannedThisWeek: number
}

/**
 * A session is a day with at least one set logged in a workout, on or after the day the programme
 * started. Sets logged by hand, and older saved sets with no date, do not count.
 */
export function progressFor(p: Programme, c: Chosen, entries: Entry[], now: number): ProgrammeProgress {
  const from = startOfDay(c.startedAt)
  const days = new Set<number>()
  for (const e of entries) {
    if (e.source === 'workout' && typeof e.at === 'number' && e.at >= from) days.add(startOfDay(e.at))
  }
  const sessionsTotal = p.weeks * p.perWeek
  const sessionsDone = Math.min(days.size, sessionsTotal)
  const week = weeksBetween(c.startedAt, now) + 1
  const finished = week > p.weeks || sessionsDone >= sessionsTotal

  // Stages come from the programme; if their weeks do not add up, treat the programme as one stage.
  const spec =
    p.stages.reduce((n, s) => n + s.weeks, 0) === p.weeks
      ? p.stages
      : [{ name: p.name, weeks: p.weeks, focus: '' }]
  let firstWeek = 1
  let used = 0
  const stages: StageProgress[] = spec.map((s) => {
    const size = s.weeks * p.perWeek
    const done = Math.max(0, Math.min(size, sessionsDone - used))
    used += size
    const stage: StageProgress = {
      name: s.name,
      focus: s.focus,
      weeks: s.weeks,
      firstWeek,
      lastWeek: firstWeek + s.weeks - 1,
      size,
      done,
      current: false,
    }
    firstWeek += s.weeks
    return stage
  })

  // The current stage is the first one with sessions still to do, so the strips and the label agree.
  if (!finished) {
    const first = stages.find((st) => st.done < st.size)
    if (first) first.current = true
  }

  const monday = mondayOf(now)
  const done = Array.from({ length: 7 }, (_, i) => days.has(addDays(monday, i)))
  const planned = plannedDays(p.perWeek)
  return {
    week: Math.max(1, Math.min(week, p.weeks)),
    weeks: p.weeks,
    finished,
    sessionsDone,
    sessionsTotal,
    stages,
    planned,
    done,
    today: dayIndex(now),
    sessionsThisWeek: done.filter(Boolean).length,
    plannedThisWeek: planned.filter(Boolean).length,
  }
}
