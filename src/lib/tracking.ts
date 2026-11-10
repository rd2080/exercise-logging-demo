import type { Exercise, PrefillSource, SetValues, TrackingType } from '../types'

export const TYPE_META: Record<TrackingType, { label: string; tape: string }> = {
  reps: { label: 'Reps', tape: 'var(--color-tape-reps)' },
  reps_per_side: { label: 'Reps per side', tape: 'var(--color-tape-side)' },
  time: { label: 'Timed hold', tape: 'var(--color-tape-time)' },
  weight_reps: { label: 'Weight and reps', tape: 'var(--color-tape-weight)' },
}

export function formatValues(type: TrackingType, v: SetValues): string {
  switch (type) {
    case 'reps':
      return `${v.reps ?? 0}`
    case 'reps_per_side':
      return `${v.left ?? 0} / ${v.right ?? 0}`
    case 'time':
      return `${v.seconds ?? 0} s`
    case 'weight_reps':
      return `${v.kg ?? 0} kg × ${v.reps ?? 0}`
  }
}

export function targetText(ex: Exercise): string {
  const sets = `${ex.sets} sets`
  const t = ex.target
  switch (ex.trackingType) {
    case 'reps':
      return `${sets} of ${t.reps} reps`
    case 'reps_per_side':
      return `${sets} of ${t.left} reps each side`
    case 'time':
      return `${sets} of ${t.seconds} seconds`
    case 'weight_reps':
      return `${sets} of ${t.reps} reps at ${t.kg} kg`
  }
}

export function initialDraft(ex: Exercise): { values: SetValues; source: PrefillSource } {
  if (ex.last) return { values: { ...ex.last }, source: 'last-session' }
  return { values: { ...ex.target }, source: 'plan' }
}

export const SOURCE_NOTE: Record<PrefillSource, string> = {
  'last-session': 'Prefilled from your last session',
  plan: "Prefilled from today's plan",
  'previous-set': 'Same as your last set',
  hold: 'Taken from your timed hold',
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}
