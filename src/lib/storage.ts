import { MAX_NAME, type Entry } from '../entries'
import type { SetValues, TrackingType } from '../types'

/** Entries logged by hand live in this browser only. Nothing is sent anywhere. */
export const ENTRIES_KEY = 'exercise-demo:entries'
const VERSION = 1
const MAX_ENTRIES = 500

const TYPES: TrackingType[] = ['reps', 'reps_per_side', 'time', 'weight_reps']
export const BACKUP_KEY = 'exercise-demo:entries:backup'

/** Required value keys and their maximums, matching the steppers in SetFields. */
const SHAPE: Record<TrackingType, Partial<Record<keyof SetValues, number>>> = {
  reps: { reps: 99 },
  reps_per_side: { left: 99, right: 99 },
  time: { seconds: 300 },
  weight_reps: { kg: 300, reps: 99 },
}

// Control characters plus bidi embedding, override and isolate marks.
const UNSAFE_CHARS = /[\p{Cc}\u202A-\u202E\u2066-\u2069]/gu

function validValues(type: TrackingType, raw: unknown): SetValues | null {
  if (!raw || typeof raw !== 'object') return null
  const values = raw as Record<string, unknown>
  const shape = SHAPE[type]
  const keys = Object.keys(shape) as (keyof SetValues)[]
  if (Object.keys(values).length !== keys.length) return null
  const out: SetValues = {}
  for (const k of keys) {
    const v = values[k]
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > shape[k]!) return null
    if (!(k === 'kg' ? Number.isInteger(v * 2) : Number.isInteger(v))) return null
    out[k] = v
  }
  return out
}

function cleanEntry(x: unknown): Entry | null {
  if (!x || typeof x !== 'object') return null
  const e = x as Record<string, unknown>
  if (typeof e.id !== 'string' || e.id.length === 0 || e.id.length > 80) return null
  if (typeof e.name !== 'string') return null
  const name = e.name.replace(UNSAFE_CHARS, '').trim()
  if (name.length === 0 || name.length > MAX_NAME) return null
  if (!TYPES.includes(e.trackingType as TrackingType)) return null
  const trackingType = e.trackingType as TrackingType
  const values = validValues(trackingType, e.values)
  if (!values) return null
  if (e.exerciseId !== undefined && (typeof e.exerciseId !== 'string' || e.exerciseId.length > 80)) return null
  if (e.source !== undefined && e.source !== 'workout' && e.source !== 'hand') return null
  if (e.at !== undefined && !isTimestamp(e.at)) return null
  return { ...(e as unknown as Entry), id: e.id, name, trackingType, values }
}

/** Keeps a copy of data we cannot read, so a later save cannot destroy it. */
function backUp(raw: string) {
  try {
    window.localStorage.setItem(BACKUP_KEY, raw)
  } catch {
    // Nothing more we can do.
  }
}

/** A plausible time: after the year 2001 and before the year 2100. */
export function isTimestamp(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x) && x > 1e12 && x < 4.1e12
}

/** Reads saved entries. Anything missing, unreadable or from another version becomes an empty list. */
export function loadEntries(): Entry[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(ENTRIES_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as { v?: number; entries?: unknown }
    if (data?.v !== VERSION || !Array.isArray(data.entries)) {
      backUp(raw)
      return []
    }
    const seen = new Set<string>()
    const out: Entry[] = []
    for (const item of data.entries) {
      const entry = cleanEntry(item)
      if (entry && !seen.has(entry.id)) {
        seen.add(entry.id)
        out.push(entry)
      }
    }
    return out.slice(0, MAX_ENTRIES)
  } catch {
    if (raw) backUp(raw)
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
