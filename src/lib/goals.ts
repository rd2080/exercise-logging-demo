import type { Entry } from '../entries'
import type { Exercise, SetValues, TrackingType } from '../types'
import { startOfDay } from './weeks'

/** A logged set reaches the plan's target when every number it asks for is met or beaten. */
export function meetsTarget(values: SetValues, target: SetValues, type: TrackingType): boolean {
  const ok = (got: number | undefined, want: number | undefined) => want === undefined || (got ?? 0) >= want
  switch (type) {
    case 'reps':
      return ok(values.reps, target.reps)
    case 'reps_per_side':
      return ok(values.left, target.left) && ok(values.right, target.right)
    case 'time':
      return ok(values.seconds, target.seconds)
    case 'weight_reps':
      return ok(values.reps, target.reps) && ok(values.kg, target.kg)
  }
}

/** Workout sets (not hand-logged ones) grouped by the day they were logged. */
function workoutDays(entries: Entry[]): Map<number, Entry[]> {
  const days = new Map<number, Entry[]>()
  for (const e of entries) {
    if (e.source !== 'workout' || typeof e.at !== 'number') continue
    const day = startOfDay(e.at)
    days.set(day, [...(days.get(day) ?? []), e])
  }
  return days
}

/** The plan's exercises that have every set logged in a workout on the given entries. */
export function exercisesCompleted(plan: Exercise[], dayEntries: Entry[]): Exercise[] {
  return plan.filter((ex) => dayEntries.filter((e) => e.exerciseId === ex.id).length >= ex.sets)
}

/** True when every exercise in the plan has all its sets logged in the given workout entries. */
export function sessionComplete(plan: Exercise[], dayEntries: Entry[]): boolean {
  return plan.length > 0 && exercisesCompleted(plan, dayEntries).length === plan.length
}

/** True when every exercise has all its sets logged and each of those sets matched the target. */
function planHit(plan: Exercise[], dayEntries: Entry[]): boolean {
  if (!sessionComplete(plan, dayEntries)) return false
  return plan.every((ex) => {
    const sets = dayEntries.filter((e) => e.exerciseId === ex.id)
    return sets.filter((e) => meetsTarget(e.values, ex.target, ex.trackingType)).length >= ex.sets
  })
}

/** How far along each goal is, worked out from what was logged. */
export function goalProgress(entries: Entry[], plan: Exercise[]): Record<string, number> {
  const days = workoutDays(entries)
  const dayLists = [...days.entries()].sort((a, b) => a[0] - b[0])

  let full = 0
  let hit = 0
  for (const [, list] of dayLists) {
    if (sessionComplete(plan, list)) full = 1
    if (planHit(plan, list)) hit = 1
  }

  // Week one: sessions on different days in the 7 days from the first workout.
  let weekOne = 0
  if (dayLists.length > 0) {
    const first = dayLists[0][0]
    weekOne = dayLists.filter(([d]) => d < first + 7 * 24 * 60 * 60 * 1000).length
  }

  return {
    'first-set': entries.length > 0 ? 1 : 0,
    'full-session': full,
    'hit-plan': hit,
    'week-one': weekOne,
  }
}
