import type { SetValues, TrackingType } from '../types'
import { Stepper } from './Stepper'

interface SetFieldsProps {
  type: TrackingType
  values: SetValues
  onChange: (patch: SetValues) => void
}

/** The one-tap steppers for a set. Which fields show depends on the tracking type. */
export function SetFields({ type, values, onChange }: SetFieldsProps) {
  switch (type) {
    case 'reps':
      return (
        <Stepper label="Reps" value={values.reps ?? 0} min={0} max={99} step={1} onChange={(reps) => onChange({ reps })} />
      )
    case 'reps_per_side':
      return (
        <div className="flex gap-4">
          <Stepper compact label="Left" value={values.left ?? 0} min={0} max={99} step={1} onChange={(left) => onChange({ left })} />
          <Stepper compact label="Right" value={values.right ?? 0} min={0} max={99} step={1} onChange={(right) => onChange({ right })} />
        </div>
      )
    case 'time':
      return (
        <Stepper
          label="Hold time"
          unit="s"
          value={values.seconds ?? 0}
          min={5}
          max={300}
          step={5}
          onChange={(seconds) => onChange({ seconds })}
        />
      )
    case 'weight_reps':
      return (
        <div className="flex gap-4">
          <Stepper compact label="Weight" unit="kg" value={values.kg ?? 0} min={0} max={300} step={2.5} onChange={(kg) => onChange({ kg })} />
          <Stepper compact label="Reps" value={values.reps ?? 0} min={0} max={99} step={1} onChange={(reps) => onChange({ reps })} />
        </div>
      )
  }
}
