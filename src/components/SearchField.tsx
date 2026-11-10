import { Search, X } from 'lucide-react'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
}

/** A search box with a clear button. The font is 16px or larger so phones do not zoom in. */
export function SearchField({ value, onChange, label }: SearchFieldProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        size={22}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder="Search exercises"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={60}
        className="h-14 w-full rounded-2xl bg-surface-2 pr-12 pl-12 text-lg text-ink placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        data-testid="search"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="press absolute top-1/2 right-0 grid size-12 -translate-y-1/2 place-items-center text-muted"
        >
          <X size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
