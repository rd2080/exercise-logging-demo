import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'

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

export function Stepper({ label, unit, value: rawValue, min, max, step, compact, onChange }: StepperProps) {
  const value = Math.min(max, Math.max(min, Number.isFinite(rawValue) ? rawValue : min))
  const labelId = useId()
  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next * 100) / 100)))

  const minus = (
    <button
      type="button"
      className={`press grid h-14 short:h-12 place-items-center rounded-2xl bg-surface-2 ${compact ? 'flex-1' : 'w-14 shrink-0'}`}
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
      className={`press grid h-14 short:h-12 place-items-center rounded-2xl bg-surface-2 ${compact ? 'flex-1' : 'w-14 shrink-0'}`}
      aria-label={`Increase ${label.toLowerCase()}`}
      disabled={value >= max}
      onClick={() => set(value + step)}
    >
      <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
  const readout = (
    <output
      className={`num text-center text-[44px] leading-none font-bold max-[360px]:text-[32px] short:text-[36px] ${compact ? 'block' : 'min-w-[3.2ch]'}`}
      aria-live="polite"
      aria-labelledby={labelId}
    >
      {value}
      {unit && <span className="ml-1 text-lg font-semibold whitespace-nowrap text-muted">{unit}</span>}
    </output>
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 short:gap-1" role="group" aria-label={label}>
      <span id={labelId} className="text-[15px] font-medium text-muted">{label}</span>
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
