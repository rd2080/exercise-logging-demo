import { SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { ExerciseRow } from '../components/ExerciseRow'
import { FilterSheet } from '../components/FilterSheet'
import { SearchField } from '../components/SearchField'
import { NO_FILTERS, activeFilterCount, filterExercises, hasAnyFilter, type Filters } from '../lib/library'
import type { Exercise } from '../types'

interface ExercisesScreenProps {
  exercises: Exercise[]
  onStart: () => void
  onOpen: (id: string) => void
}

export function ExercisesScreen({ exercises, onStart, onOpen }: ExercisesScreenProps) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [sheet, setSheet] = useState(false)
  const shown = useMemo(() => filterExercises(exercises, filters), [exercises, filters])
  const total = exercises.length
  const active = activeFilterCount(filters)
  const filtered = hasAnyFilter(filters)

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="exercises"
    >
      <main className="flex flex-1 flex-col gap-4 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Exercises</h1>
          <p className="m-0 text-lg text-muted" role="status" data-testid="result-count">
            {filtered ? `${shown.length} of ${total}` : total} {total === 1 ? 'exercise' : 'exercises'}
          </p>
        </header>

        {total === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No exercises yet"
            body="Your exercises will be listed here once you choose a programme."
            actionLabel="Choose a programme"
            onAction={onStart}
          />
        ) : (
          <>
            <div className="flex gap-2">
              <SearchField
                value={filters.query}
                onChange={(query) => setFilters((f) => ({ ...f, query }))}
                label="Search exercises"
              />
              <button
                type="button"
                className="press relative flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-surface-2 px-4 text-lg font-semibold"
                onClick={() => setSheet(true)}
                aria-label={active ? `Filters, ${active} selected` : 'Filters'}
                data-testid="open-filters"
              >
                <SlidersHorizontal size={22} aria-hidden="true" />
                <span aria-hidden="true">Filters</span>
                {active > 0 && (
                  <span
                    className="num grid min-w-6 place-items-center rounded-full bg-ink px-1.5 text-[15px] font-bold text-on-tape"
                    aria-hidden="true"
                    data-testid="filter-badge"
                  >
                    {active}
                  </span>
                )}
              </button>
            </div>

            {shown.length === 0 ? (
              <EmptyState
                illustration={<EmptySlots />}
                title="No exercises match"
                body="Try a different search, or remove a filter."
                actionLabel="Reset filters"
                onAction={() => setFilters(NO_FILTERS)}
              />
            ) : (
              <ul className="m-0 flex list-none flex-col p-0" data-testid="exercise-list">
                {shown.map((e) => (
                  <ExerciseRow key={e.id} exercise={e} keyed showAttributes onOpen={onOpen} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <FilterSheet
        open={sheet}
        onOpenChange={setSheet}
        filters={filters}
        onChange={setFilters}
        count={shown.length}
      />
    </div>
  )
}
