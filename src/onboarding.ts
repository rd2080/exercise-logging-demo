import { onboarding as data } from './data/fixtures'
import { bodySummary, DEFAULT_UNITS, type Units } from './lib/body'

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
  level: string
  tags: string[]
  stages: { name: string; weeks: number; focus: string }[]
}

export const GOALS = data.goals as Option[]
export const ACTIVITY = data.activity as Option[]
export const EQUIPMENT = data.equipment as Option[]
export const LIMITS = data.limits as Option[]
export const PULLUP_CHECKS = data.pullupChecks as Option[]
export const PROGRAMMES = data.programmes as Programme[]

export const MAX_GOALS = 3

/** Training styles the person can rank. Ids match the programme tags. Placeholder list. */
export const STYLES: Option[] = [
  { id: 'Strength', label: 'Strength', detail: 'Getting stronger at the basics' },
  { id: 'Skill', label: 'Skills', detail: 'Working toward a move like a handstand' },
  { id: 'Bodyweight', label: 'Bodyweight', detail: 'Training with no kit' },
]

export interface Answers {
  goals: string[]
  activity: string | null
  equipment: string[]
  pullup: { hang: boolean; secure: boolean }
  /** Follow-ups for other equipment. Off unless the person says otherwise. */
  extras: { heavy: boolean; anchor: boolean }
  limits: string[]
  /** Optional body measurements, always stored in kg and cm. */
  weightKg: number | null
  heightCm: number | null
  /** Training styles in order of preference. Optional. */
  styles: string[]
}

export const EMPTY_ANSWERS: Answers = {
  goals: [],
  activity: null,
  equipment: [],
  pullup: { hang: false, secure: false },
  extras: { heavy: false, anchor: false },
  limits: [],
  weightKg: null,
  heightCm: null,
  styles: [],
}

export type RowId = 'goals' | 'activity' | 'equipment' | 'limits' | 'style' | 'body'

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

export function summaryText(a: Answers, row: RowId, units: Units = DEFAULT_UNITS): string | null {
  switch (row) {
    case 'goals':
      return a.goals.length ? a.goals.map((g) => labelOf(GOALS, g)).join(', ') : null
    case 'activity':
      return a.activity ? labelOf(ACTIVITY, a.activity) : null
    case 'equipment':
      return a.equipment.length ? a.equipment.map((e) => labelOf(EQUIPMENT, e)).join(', ') : null
    case 'style':
      return a.styles.length ? a.styles.map((x) => labelOf(STYLES, x)).join(', ') : null
    case 'body':
      return bodySummary(a.weightKg, a.heightCm, units)
    case 'limits':
      return a.limits.length ? a.limits.map((l) => labelOf(LIMITS, l)).join(', ') : 'No limits'
  }
}

export const DUMBBELL_CHECK: Option = { id: 'heavy', label: 'I have a pair heavier than 10 kg each' }
export const BAND_CHECK: Option = { id: 'anchor', label: 'I can anchor the band to a door or a post' }

export function dumbbellConsequence(heavy: boolean): string {
  return heavy ? 'Your plan can include heavy dumbbell exercises.' : 'Your plan will keep dumbbell exercises light.'
}

export function bandConsequence(anchor: boolean): string {
  return anchor ? 'Your plan can include anchored band exercises.' : 'Your plan will skip exercises that need an anchored band.'
}

export function pullupConsequence(p: Answers['pullup']): string {
  if (p.hang && p.secure) return 'Your plan can include every pull-up bar exercise.'
  if (p.hang) return 'Your plan will skip swinging and jumping pull-up bar exercises.'
  if (p.secure) return 'Your plan will skip hanging pull-up bar exercises.'
  return 'Your plan will skip hanging and swinging pull-up bar exercises.'
}

export function recommended(a: Answers): { id: string; reason: string } | null {
  if (PROGRAMMES.length === 0) return null
  if (a.goals[0] === 'skill') {
    return { id: 'handstand', reason: 'Matches your first goal: learn a skill' }
  }
  const level = a.activity ?? 'sitting'
  if (a.styles.length > 0) {
    // Each ranked style a programme carries earns more points the higher it is ranked.
    // A matching activity level breaks ties and the first programme wins after that.
    const score = (x: Programme) =>
      x.tags.reduce((n, t) => {
        const i = a.styles.indexOf(t)
        return i >= 0 ? n + (a.styles.length - i) : n
      }, 0) + (x.forLevels.includes(level) ? 0.5 : 0)
    const ranked = [...PROGRAMMES].sort((x, y) => score(y) - score(x))
    const top = ranked[0]
    if (score(top) >= 1) {
      const tag = a.styles.find((t) => top.tags.includes(t)) ?? a.styles[0]
      return { id: top.id, reason: `Matches your favourite training style: ${labelOf(STYLES, tag).toLowerCase()}` }
    }
  }
  const p = PROGRAMMES.find((x) => x.forLevels.includes(level)) ?? PROGRAMMES[0]
  return { id: p.id, reason: `Matches your activity level: ${labelOf(ACTIVITY, level).toLowerCase()}` }
}
