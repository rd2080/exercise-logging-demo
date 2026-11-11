import onboardingDemo from '../../fixtures/onboarding.json'
import sessionDemo from '../../fixtures/session.json'
import goalsDemo from '../../fixtures/goals.json'
import onboardingWorst from '../../fixtures/worst/onboarding.json'
import sessionWorst from '../../fixtures/worst/session.json'
import goalsWorst from '../../fixtures/worst/goals.json'
import libraryDemo from '../../fixtures/library.json'
import type { Exercise, Session } from '../types'

/** Dev-only data modes for stress testing the UI. Production always uses the demo data. */
export type DataMode = 'demo' | 'worst' | 'empty' | 'one' | 'huge'
export const DATA_MODES: DataMode[] = ['demo', 'worst', 'empty', 'one', 'huge']

function readMode(): DataMode {
  if (!import.meta.env.DEV) return 'demo'
  const m = new URLSearchParams(window.location.search).get('data')
  return DATA_MODES.includes(m as DataMode) ? (m as DataMode) : 'demo'
}

export const dataMode = readMode()

const worstSession = sessionWorst as unknown as Session
const demoSession = sessionDemo as unknown as Session

function repeat<T extends { id: string }>(items: T[], n: number): T[] {
  return Array.from({ length: n }, (_, i) => ({ ...items[i % items.length], id: `${items[i % items.length].id}-${i}` }))
}

function pickSession(): Session {
  switch (dataMode) {
    case 'worst':
      return worstSession
    case 'empty':
      return { ...demoSession, exercises: [] }
    case 'one':
      return { ...demoSession, exercises: [{ ...demoSession.exercises[0], sets: 1 }] }
    case 'huge':
      return { ...worstSession, exercises: repeat(worstSession.exercises, 12) }
    default:
      return demoSession
  }
}

function pickOnboarding() {
  switch (dataMode) {
    case 'worst':
      return onboardingWorst
    case 'empty':
      return { ...onboardingDemo, programmes: [] }
    case 'one':
      return { ...onboardingDemo, programmes: [{ ...onboardingDemo.programmes[0], weeks: 1, perWeek: 1 }] }
    case 'huge':
      return {
        ...onboardingWorst,
        equipment: repeat(onboardingWorst.equipment, 30),
        goals: repeat(onboardingWorst.goals, 20),
      }
    default:
      return onboardingDemo
  }
}

function pickGoals() {
  switch (dataMode) {
    case 'worst':
      return goalsWorst
    case 'empty':
      return { ...goalsDemo, goals: [] }
    case 'one':
      return { ...goalsDemo, goals: [goalsDemo.goals[0]] }
    case 'huge':
      return { ...goalsWorst, goals: repeat(goalsWorst.goals, 40) }
    default:
      return goalsDemo
  }
}

export const session = pickSession()
export const onboarding = pickOnboarding()
export const goalsData = pickGoals()

const demoLibrary = libraryDemo.exercises as unknown as Exercise[]

function pickLibrary(): Exercise[] {
  switch (dataMode) {
    case 'worst':
      // Long names and a mix of every filter value.
      return demoLibrary.map((e, i) =>
        i % 4 === 0
          ? { ...e, name: `${e.name} with a slow tempo, pausing for two seconds at the bottom of every repetition` }
          : e,
      )
    case 'empty':
      return []
    case 'one':
      return [demoLibrary[0]]
    case 'huge':
      return repeat(demoLibrary, 200).map((e, i) => ({ ...e, name: `${e.name} ${i + 1}` }))
    default:
      return demoLibrary
  }
}

export const library = pickLibrary()
