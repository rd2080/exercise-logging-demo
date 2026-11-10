import { MAX_NAME, type Entry } from '../entries'
import type { SetValues, TrackingType } from '../types'

/** Entries logged by hand live in this browser only. Nothing is sent anywhere. */
export const ENTRIES_KEY = 'exercise-demo:entries'
const VERSION = 1
const MAX_ENTRIES = 500

const TYPES: TrackingType[] = ['reps', 'reps_per_side', 'time', 'weight_reps']
const VALUE_KEYS: (keyof SetValues)[] = ['reps', 'left', 'right', 'seconds', 'kg']

function isEntry(x: unknown): x is Entry {
  if (!x || typeof x !== 'object') return false
  const e = x as Record<string, unknown>
  if (typeof e.id !== 'string' || e.id.length === 0 || e.id.length > 80) return false
  if (typeof e.name !== 'string' || e.name.trim().length === 0 || e.name.length > MAX_NAME) return false
  if (!TYPES.includes(e.trackingType as TrackingType)) return false
  if (!e.values || typeof e.values !== 'object') return false
  for (const [k, v] of Object.entries(e.values as Record<string, unknown>)) {
    if (!VALUE_KEYS.includes(k as keyof SetValues)) return false
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 10000) return false
  }
  if (e.source !== undefined && e.source !== 'workout' && e.source !== 'hand') return false
  return e.exerciseId === undefined || typeof e.exerciseId === 'string'
}

/** Reads saved entries. Anything missing, unreadable or from another version becomes an empty list. */
export function loadEntries(): Entry[] {
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as { v?: number; entries?: unknown }
    if (data?.v !== VERSION || !Array.isArray(data.entries)) return []
    const seen = new Set<string>()
    const out: Entry[] = []
    for (const item of data.entries) {
      if (isEntry(item) && !seen.has(item.id)) {
        seen.add(item.id)
        out.push(item)
      }
    }
    return out.slice(0, MAX_ENTRIES)
  } catch {
    return []
  }
}

/** Saves entries, newest first. Returns false when the browser refuses (private mode, full disk). */
export function saveEntries(entries: Entry[]): boolean {
  try {
    window.localStorage.setItem(
      ENTRIES_KEY,
      JSON.stringify({ v: VERSION, entries: entries.slice(0, MAX_ENTRIES) }),
    )
    return true
  } catch {
    return false
  }
}
