import { startOfDay } from './weeks'

export type RoutineId = 'warmup' | 'cooldown'
export const ROUTINES_KEY = 'exercise-demo:routines'

/** Which of the warm-up and cool-down were finished on a given day. Saved in this browser only. */
export interface RoutinesDone {
  day: number
  done: RoutineId[]
}

export function loadRoutines(now: number): RoutineId[] {
  try {
    const raw = window.localStorage.getItem(ROUTINES_KEY)
    if (!raw) return []
    const d = JSON.parse(raw) as { v?: number; day?: unknown; done?: unknown }
    if (d?.v !== 1 || d.day !== startOfDay(now) || !Array.isArray(d.done)) return []
    return d.done.filter((x): x is RoutineId => x === 'warmup' || x === 'cooldown')
  } catch {
    return []
  }
}

export function saveRoutines(done: RoutineId[], now: number): boolean {
  try {
    window.localStorage.setItem(ROUTINES_KEY, JSON.stringify({ v: 1, day: startOfDay(now), done }))
    return true
  } catch {
    return false
  }
}
