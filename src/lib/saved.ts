export const SAVED_KEY = 'exercise-demo:saved'
const MAX_SAVED = 100

/** The saved exercise ids. Anything that is not a short string is dropped. */
export function loadSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const d = JSON.parse(raw) as { v?: number; ids?: unknown }
    if (d?.v !== 1 || !Array.isArray(d.ids)) return []
    return [...new Set(d.ids.filter((x): x is string => typeof x === 'string' && x.length > 0 && x.length <= 40))].slice(0, MAX_SAVED)
  } catch {
    return []
  }
}

/** Returns false when the browser refused to store the list. */
export function saveSaved(ids: string[]): boolean {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify({ v: 1, ids }))
    return true
  } catch {
    return false
  }
}
