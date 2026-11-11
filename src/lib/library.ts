import type { CategoryId, EquipmentId, Exercise, LevelId, TrackingType } from '../types'
import { TYPE_META } from './tracking'

export const EQUIPMENT_LABELS: Record<EquipmentId, string> = {
  none: 'Bodyweight',
  dumbbells: 'Dumbbells',
  band: 'Resistance band',
  kettlebell: 'Kettlebell',
  pullup: 'Pull-up bar',
}
export const LEVEL_LABELS: Record<LevelId, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  core: 'Core',
  skill: 'Skill',
}

export interface Filters {
  query: string
  types: TrackingType[]
  equipment: EquipmentId[]
  levels: LevelId[]
  categories: CategoryId[]
  /** Only exercises the person has saved. */
  saved: boolean
}

export const NO_FILTERS: Filters = { query: '', types: [], equipment: [], levels: [], categories: [], saved: false }

/** How many filter groups have a choice made. The search text is not counted: it has its own field. */
export function activeFilterCount(f: Filters): number {
  return f.types.length + f.equipment.length + f.levels.length + f.categories.length + (f.saved ? 1 : 0)
}

export function hasAnyFilter(f: Filters): boolean {
  return activeFilterCount(f) > 0 || f.query.trim().length > 0
}

/** Within a group the choices are alternatives (any of); between groups they all must hold. */
export function matches(e: Exercise, f: Filters): boolean {
  const q = f.query.trim().toLowerCase()
  if (q) {
    const hay = [
      e.name,
      TYPE_META[e.trackingType].label,
      e.equipment ? EQUIPMENT_LABELS[e.equipment] : '',
      e.level ? LEVEL_LABELS[e.level] : '',
    ]
      .join(' ')
      .toLowerCase()
    if (!q.split(/\s+/).every((word) => hay.includes(word))) return false
  }
  if (f.types.length && !f.types.includes(e.trackingType)) return false
  if (f.equipment.length && !(e.equipment && f.equipment.includes(e.equipment))) return false
  if (f.categories.length && !(e.category && f.categories.includes(e.category))) return false
  if (f.levels.length && !(e.level && f.levels.includes(e.level))) return false
  return true
}

export function filterExercises(list: Exercise[], f: Filters): Exercise[] {
  return list.filter((e) => matches(e, f))
}

/** Each limit on the set-up screen rules out exercises with the matching demand. */
export const LIMIT_DEMAND: Record<string, string> = { quiet: 'loud', space: 'space', norun: 'running' }

export function fitsLimits(e: Exercise, limits: string[]): boolean {
  const demands = e.demands ?? []
  return !limits.some((l) => LIMIT_DEMAND[l] && (demands as string[]).includes(LIMIT_DEMAND[l]))
}
