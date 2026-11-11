export type WeightUnit = 'kg' | 'lb'
export type HeightUnit = 'cm' | 'ft'
export interface Units {
  weight: WeightUnit
  height: HeightUnit
}

export const UNITS_KEY = 'exercise-demo:units'
export const DEFAULT_UNITS: Units = { weight: 'kg', height: 'cm' }

export const WEIGHT_KG = { min: 20, max: 300 }
export const HEIGHT_CM = { min: 100, max: 250 }

export function loadUnits(): Units {
  try {
    const raw = window.localStorage.getItem(UNITS_KEY)
    if (!raw) return DEFAULT_UNITS
    const d = JSON.parse(raw) as { v?: number; weight?: unknown; height?: unknown }
    if (d?.v !== 1) return DEFAULT_UNITS
    return {
      weight: d.weight === 'lb' ? 'lb' : 'kg',
      height: d.height === 'ft' ? 'ft' : 'cm',
    }
  } catch {
    return DEFAULT_UNITS
  }
}

export function saveUnits(u: Units): void {
  try {
    window.localStorage.setItem(UNITS_KEY, JSON.stringify({ v: 1, ...u }))
  } catch {
    /* The choice just is not remembered. */
  }
}

const LB_PER_KG = 2.20462
const CM_PER_IN = 2.54

export const kgToLb = (kg: number) => kg * LB_PER_KG
export const lbToKg = (lb: number) => lb / LB_PER_KG
export function cmToFtIn(cm: number): { ft: number; inch: number } {
  const total = Math.round(cm / CM_PER_IN)
  return { ft: Math.floor(total / 12), inch: total % 12 }
}
export const ftInToCm = (ft: number, inch: number) => (ft * 12 + inch) * CM_PER_IN

/** A number from typed text, or null when it is empty or not a number. */
export function parseNumber(text: string): number | null {
  const t = text.trim().replace(',', '.')
  if (t === '') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

export function inRange(n: number | null, r: { min: number; max: number }): n is number {
  return n !== null && n >= r.min && n <= r.max
}

export function bodySummary(weightKg: number | null, heightCm: number | null, u: Units): string | null {
  const parts: string[] = []
  if (weightKg !== null) parts.push(u.weight === 'kg' ? `${Math.round(weightKg)} kg` : `${Math.round(kgToLb(weightKg))} lb`)
  if (heightCm !== null) {
    if (u.height === 'cm') parts.push(`${Math.round(heightCm)} cm`)
    else {
      const { ft, inch } = cmToFtIn(heightCm)
      parts.push(`${ft} ft ${inch} in`)
    }
  }
  return parts.length ? parts.join(', ') : null
}
