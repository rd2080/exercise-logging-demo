import { LIMITS } from '../onboarding'

export const LIMITS_KEY = 'exercise-demo:limits'

/** The saved limits, keeping only ones the set-up screen knows. */
export function loadLimits(): string[] {
  try {
    const raw = window.localStorage.getItem(LIMITS_KEY)
    if (!raw) return []
    const d = JSON.parse(raw) as { v?: number; limits?: unknown }
    if (d?.v !== 1 || !Array.isArray(d.limits)) return []
    const known = new Set(LIMITS.map((l) => l.id))
    return d.limits.filter((x): x is string => typeof x === 'string' && known.has(x))
  } catch {
    return []
  }
}

export function saveLimits(limits: string[]): void {
  try {
    window.localStorage.setItem(LIMITS_KEY, JSON.stringify({ v: 1, limits }))
  } catch {
    /* The limits are just not remembered. */
  }
}
