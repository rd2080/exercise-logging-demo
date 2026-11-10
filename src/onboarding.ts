import data from '../fixtures/onboarding.json'

export interface Option {
  id: string
  label: string
  detail?: string
  short?: string
}

export interface Programme {
  id: string
  name: string
  weeks: number
  perWeek: number
  needs: string
  summary: string
  forLevels: string[]
}

export const GOALS = data.goals as Option[]
export const ACTIVITY = data.activity as Option[]
export const EQUIPMENT = data.equipment as Option[]
export const LIMITS = data.limits as Option[]
export const PULLUP_CHECKS = data.pullupChecks as Option[]
export const PROGRAMMES = data.programmes as Programme[]

export const MAX_GOALS = 3

export interface Answers {
  goals: string[]
  activity: string | null
  equipment: string[]
  pullup: { hang: boolean; secure: boolean }
  limits: string[]
}

export const EMPTY_ANSWERS: Answers = {
  goals: [],
  activity: null,
  equipment: [],
  pullup: { hang: false, secure: false },
  limits: [],
}

export type RowId = 'goals' | 'activity' | 'equipment' | 'limits'

export function labelOf(options: Option[], id: string): string {
  const o = options.find((x) => x.id === id)
  return o?.short ?? o?.label ?? id
}

export function missing(a: Answers): string[] {
  const out: string[] = []
  if (a.goals.length === 0) out.push('goal')
  if (a.activity === null) out.push('activity level')
  if (a.equipment.length === 0) out.push('equipment')
  return out
}

export function summaryText(a: Answers, row: RowId): string | null {
  switch (row) {
    case 'goals':
      return a.goals.length ? a.goals.map((g) => labelOf(GOALS, g)).join(', ') : null
    case 'activity':
      return a.activity ? labelOf(ACTIVITY, a.activity) : null
    case 'equipment':
      return a.equipment.length ? a.equipment.map((e) => labelOf(EQUIPMENT, e)).join(', ') : null
    case 'limits':
      return a.limits.length ? a.limits.map((l) => labelOf(LIMITS, l)).join(', ') : 'No limits'
  }
}

export function pullupConsequence(p: Answers['pullup']): string {
  if (p.hang && p.secure) return 'Your plan can include every pull-up bar exercise.'
  if (p.hang) return 'Your plan will skip swinging and jumping pull-up bar exercises.'
  if (p.secure) return 'Your plan will skip hanging pull-up bar exercises.'
  return 'Your plan will skip hanging and swinging pull-up bar exercises.'
}

export function recommended(a: Answers): { id: string; reason: string } {
  if (a.goals[0] === 'skill') {
    return { id: 'handstand', reason: 'Matches your first goal: learn a skill' }
  }
  const level = a.activity ?? 'sitting'
  const p = PROGRAMMES.find((x) => x.forLevels.includes(level)) ?? PROGRAMMES[0]
  return { id: p.id, reason: `Matches your activity level: ${labelOf(ACTIVITY, level).toLowerCase()}` }
}
