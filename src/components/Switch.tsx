interface SwitchProps {
  checked: boolean
  label: string
  detail?: string
  onChange: (next: boolean) => void
}

export function Switch({ checked, label, detail, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="press flex min-h-16 w-full items-center justify-between gap-4 border-t border-line py-2.5 text-left first:border-t-0"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xl leading-tight font-semibold">{label}</span>
        {detail && <span className="text-[15px] text-muted">{detail}</span>}
      </span>
      <span
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-150 motion-reduce:transition-none ${checked ? 'bg-(--tape)' : 'bg-surface-2'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-1 left-1 size-6 rounded-full transition-transform duration-150 ease-(--ease-out-expo) motion-reduce:transition-none ${checked ? 'translate-x-6 bg-on-tape' : 'bg-muted'}`}
        />
      </span>
    </button>
  )
}
