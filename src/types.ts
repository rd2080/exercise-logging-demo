export type TrackingType = 'reps' | 'reps_per_side' | 'time' | 'weight_reps'

export interface SetValues {
  reps?: number
  left?: number
  right?: number
  seconds?: number
  kg?: number
}

export interface Exercise {
  id: string
  name: string
  trackingType: TrackingType
  sets: number
  target: SetValues
  last: SetValues | null
  cue: string
}

export interface Session {
  name: string
  restSeconds: number
  exercises: Exercise[]
}

export type PrefillSource = 'last-session' | 'plan' | 'previous-set' | 'hold' | 'default'
