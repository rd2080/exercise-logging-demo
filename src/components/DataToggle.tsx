import { DATA_MODES, dataMode } from '../data/fixtures'

/** Dev-only switch between demo and stress-test data. Not rendered in production builds. */
export function DataToggle() {
  if (!import.meta.env.DEV) return null
  const go = (mode: string) => {
    const params = new URLSearchParams(window.location.search)
    if (mode === 'demo') params.delete('data')
    else params.set('data', mode)
    window.location.search = params.toString()
  }
  return (
    <div
      className="fixed top-1 left-1/2 z-[100] flex -translate-x-1/2 gap-px overflow-hidden rounded bg-line p-px font-sans text-[10px]"
      role="group"
      aria-label="Data mode (dev only)"
      data-testid="data-toggle"
    >
      {DATA_MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => go(m)}
          aria-pressed={m === dataMode}
          className={`px-1.5 py-0.5 ${m === dataMode ? 'bg-ink text-on-tape' : 'bg-surface-2 text-muted'}`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
