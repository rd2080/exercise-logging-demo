import { skillsData } from '../data/fixtures'

export interface SkillClass {
  id: string
  label: string
}
export interface Skill {
  id: string
  label: string
  detail: string
  classification: string
  /** The programme built for this skill. Missing while none exists yet. */
  programmeId?: string
}

export const SKILL_CLASSES = skillsData.classifications as SkillClass[]
export const SKILLS = skillsData.skills as Skill[]

export const skillById = (id: string | null | undefined): Skill | undefined => SKILLS.find((s) => s.id === id)
export const classLabel = (id: string): string => SKILL_CLASSES.find((c) => c.id === id)?.label ?? ''

/** The one skill goal, and whether the person agreed to have their exercises adjusted for it. */
export interface SkillChoice {
  id: string
  adjust: boolean
}

export const SKILL_KEY = 'exercise-demo:skill'

export function loadSkill(): SkillChoice | null {
  try {
    const raw = window.localStorage.getItem(SKILL_KEY)
    if (!raw) return null
    const d = JSON.parse(raw) as { v?: number; id?: unknown; adjust?: unknown }
    if (d?.v !== 1 || typeof d.id !== 'string' || d.id.length === 0 || d.id.length > 60) return null
    return { id: d.id, adjust: d.adjust === true }
  } catch {
    return null
  }
}

export function saveSkill(choice: SkillChoice | null): boolean {
  try {
    if (choice === null) window.localStorage.removeItem(SKILL_KEY)
    else window.localStorage.setItem(SKILL_KEY, JSON.stringify({ v: 1, ...choice }))
    return true
  } catch {
    return false
  }
}

/** Words typed in the search box must all appear in the name, the description or the group. */
export function matchesSkill(s: Skill, query: string): boolean {
  const hay = `${s.label} ${s.detail} ${classLabel(s.classification)}`.toLowerCase()
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}
