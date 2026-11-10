import { Minus, Plus } from 'lucide-react'

interface StepperProps {
  label: string
  unit?: string
  value: number
  min: number
  max: number
  step: number
  /** Stack the value above the buttons so two steppers fit side by side. */
  compact?: boolean
  onChange: (next: number) => void
}

export function Stepper({ label, unit, value, min, max, step, compact, onChange }: StepperProps) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next * 100) / 100)))

  const minus = (
    <button
      type="button"
      className={`press grid h-14 place-items-center rounded-2xl bg-surface-2 ${compact ? 'flex-1' : 'w-14 shrink-0'}`}
      aria-label={`Decrease ${label.toLowerCase()}`}
      disabled={value <= min}
      onClick={() => set(value - step)}
    >
      <Minus size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
  const plus = (
    <button
      type="button"
      className={`press grid h-14 place-items-center rounded-2xl bg-surface-2 ${compact ? 'flex-1' : 'w-14 shrink-0'}`}
      aria-label={`Increase ${label.toLowerCase()}`}
      disabled={value >= max}
      onClick={() => set(value + step)}
    >
      <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
  const readout = (
    <output
      className={`num text-center text-[44px] leading-none font-bold ${compact ? 'block' : 'min-w-[3.2ch]'}`}
      aria-live="polite"
    >
      {value}
      {unit && <span className="ml-1 text-lg font-semibold text-muted">{unit}</span>}
    </output>
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2" role="group" aria-label={label}>
      <span className="text-[15px] font-medium text-muted">{label}</span>
      {compact ? (
        <>
          {readout}
          <div className="flex gap-2">
            {minus}
            {plus}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-2">
          {minus}
          {readout}
          {plus}
        </div>
      )}
    </div>
  )
}
