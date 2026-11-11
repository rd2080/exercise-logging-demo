import type { ReactNode } from 'react'
import { Slot } from './Slot'

interface OptionRowProps {
  role: 'checkbox' | 'radio'
  checked: boolean
  disabled?: boolean
  label: string
  detail?: string
  icon?: ReactNode
  /** Pick order shown on the tape slot (ranked multi-select). */
  rank?: number
  onClick: () => void
}

export function OptionRow({ role, checked, disabled, label, detail, icon, rank, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className="press flex min-h-16 w-full items-center gap-3 border-t border-line py-2.5 text-left first:border-t-0 disabled:opacity-45"
    >
      <Slot n={0} filled={checked} rank={rank} />
      {icon && <span className="grid size-6 shrink-0 place-items-center text-muted">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xl leading-tight font-semibold [overflow-wrap:anywhere]">{label}</span>
        {detail && <span className="text-[15px] whitespace-pre-line text-muted [overflow-wrap:anywhere]">{detail}</span>}
      </span>
    </button>
  )
}
