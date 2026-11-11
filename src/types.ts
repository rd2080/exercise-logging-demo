export type TrackingType = 'reps' | 'reps_per_side' | 'time' | 'weight_reps'

export interface SetValues {
  reps?: number
  left?: number
  right?: number
  seconds?: number
  kg?: number
}

export type EquipmentId = 'none' | 'dumbbells' | 'band' | 'kettlebell' | 'pullup'
export type LevelId = 'beginner' | 'intermediate' | 'advanced'
export type CategoryId = 'push' | 'pull' | 'legs' | 'core' | 'skill'

/** What an exercise asks of the room: noise or impact, floor space, or running. Placeholder tags. */
export type Demand = 'loud' | 'space' | 'running'

export interface Exercise {
  id: string
  name: string
  trackingType: TrackingType
  sets: number
  target: SetValues
  last: SetValues | null
  cue: string
  equipment?: EquipmentId
  level?: LevelId
  category?: CategoryId
  /** Placeholder muscles worked, in sentence case. */
  muscles?: string[]
  demands?: Demand[]
}

/** A warm-up or cool-down move. Shown for reference, not logged. Placeholder fixtures. */
export interface Routine {
  id: string
  name: string
  detail: string
}

export interface Session {
  name: string
  restSeconds: number
  exercises: Exercise[]
  warmup?: Routine[]
  cooldown?: Routine[]
}

export type PrefillSource = 'last-session' | 'plan' | 'previous-set' | 'hold' | 'default'
