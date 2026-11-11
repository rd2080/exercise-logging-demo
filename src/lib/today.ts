import type { Entry } from '../entries'
import type { Exercise } from '../types'
import { sessionComplete } from './goals'
import { startOfDay } from './weeks'

/** Sets logged in a workout on the same calendar day as `now`. */
export function workoutEntriesToday(entries: Entry[], now: number): Entry[] {
  const day = startOfDay(now)
  return entries.filter((e) => e.source === 'workout' && typeof e.at === 'number' && startOfDay(e.at) === day)
}

/** The workout is done for the day when every exercise has all its sets logged today. */
export function workoutDoneToday(entries: Entry[], plan: Exercise[], now: number): boolean {
  return sessionComplete(plan, workoutEntriesToday(entries, now))
}
