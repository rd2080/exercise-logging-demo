import type { Exercise, PrefillSource, SetValues, TrackingType } from './types'

/** A set the user logged by hand, outside a workout. */
export interface Entry {
  id: string
  name: string
  trackingType: TrackingType
  values: SetValues
  /** Plan exercise this came from, if any. */
  exerciseId?: string
  /** Where it was logged. Missing on older saved entries, which were all by hand. */
  source?: 'workout' | 'hand'
}

export const MAX_NAME = 60

export const TYPE_CHOICES: { type: TrackingType; label: string; detail: string }[] = [
  { type: 'reps', label: 'Reps', detail: 'Count the repetitions, like push‑ups' },
  { type: 'reps_per_side', label: 'Reps per side', detail: 'Left and right counted separately, like lunges' },
  { type: 'time', label: 'Timed hold', detail: 'How many seconds, like a plank' },
  { type: 'weight_reps', label: 'Weight and reps', detail: 'Weight in kg and repetitions, like a squat' },
]

const DEFAULTS: Record<TrackingType, SetValues> = {
  reps: { reps: 10 },
  reps_per_side: { left: 8, right: 8 },
  time: { seconds: 30 },
  weight_reps: { kg: 10, reps: 10 },
}

/**
 * What to prefill: your last entry of this exercise, then its last session, then the plan's target,
 * then a stated default. One tap logs it.
 */
export function suggest(
  name: string,
  type: TrackingType,
  plan: Exercise | undefined,
  entries: Entry[],
): { values: SetValues; source: PrefillSource } {
  const same = entries.find((e) => e.trackingType === type && e.name.toLowerCase() === name.toLowerCase())
  if (same) return { values: { ...same.values }, source: 'previous-set' }
  if (plan?.last) return { values: { ...plan.last }, source: 'last-session' }
  if (plan) return { values: { ...plan.target }, source: 'plan' }
  return { values: { ...DEFAULTS[type] }, source: 'default' }
}
