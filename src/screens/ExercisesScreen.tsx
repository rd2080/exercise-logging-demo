import { SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { ExerciseRow } from '../components/ExerciseRow'
import { FilterSheet } from '../components/FilterSheet'
import { SearchField } from '../components/SearchField'
import { LIMITS } from '../onboarding'
import { fitsLimits, NO_FILTERS, activeFilterCount, filterExercises, hasAnyFilter, type Filters } from '../lib/library'
import type { Exercise } from '../types'

interface ExercisesScreenProps {
  exercises: Exercise[]
  /** Limit ids from set up. Exercises that clash with them are hidden unless the person asks. */
  limits: string[]
  /** Ids of saved exercises. */
  savedIds: string[]
  onStart: () => void
  onOpen: (id: string) => void
}

export function ExercisesScreen({ exercises: all, limits, savedIds, onStart, onOpen }: ExercisesScreenProps) {
  const [showAll, setShowAll] = useState(false)
  const exercises = useMemo(() => (showAll ? all : all.filter((e) => fitsLimits(e, limits))), [all, limits, showAll])
  const limitNames = limits
    .map((id) => LIMITS.find((l) => l.id === id)?.label.toLowerCase())
    .filter((x): x is string => !!x)
    .join(' and ')
  const hidden = all.length - all.filter((e) => fitsLimits(e, limits)).length
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [sheet, setSheet] = useState(false)
  const shown = useMemo(
    () => filterExercises(exercises, filters).filter((e) => !filters.saved || savedIds.includes(e.id)),
    [exercises, filters, savedIds],
  )
  const hiddenMatches = useMemo(
    () =>
      showAll
        ? 0
        : filterExercises(all, filters).filter((e) => !fitsLimits(e, limits) && (!filters.saved || savedIds.includes(e.id))).length,
    [all, filters, limits, savedIds, showAll],
  )
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
          {total > 0 && shown.length > 0 && (
            <div
              className="tape-cut mt-2 h-3 overflow-hidden bg-surface-2"
              style={{ '--cut': '5px' } as CSSProperties}
              aria-hidden="true"
              data-testid="count-strip"
            >
              <div
                className="tape-fill h-full origin-left transition-transform duration-150 ease-(--ease-out-expo) motion-reduce:transition-none"
                style={{ transform: `scaleX(${shown.length / total})` }}
              />
            </div>
          )}
        </header>

        {hidden > 0 && (total > 0 || showAll) && (
          <p className="m-0 text-[17px] text-muted" data-testid="limits-note">
            <span role="status">
              {showAll ? `Showing ${hidden} that clash with ` : `Hiding ${hidden} that clash with `}
              {limitNames}.{' '}
            </span>
            <button type="button" className="press inline-flex min-h-12 items-center font-semibold text-ink underline underline-offset-4" onClick={() => setShowAll((v) => !v)} data-testid="limits-toggle">
              {showAll ? 'Hide them' : 'Show them'}
            </button>
          </p>
        )}

        {total === 0 && hidden > 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="Nothing fits your limits"
            body="Every exercise clashes with a limit you set. Show them, or change your limits in set up."
            actionLabel="Show them"
            onAction={() => setShowAll(true)}
            secondaryLabel="Change my limits"
            onSecondary={onStart}
          />
        ) : total === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No exercises yet"
            body="Your exercises will be listed here once you choose a programme."
            actionLabel="Choose a programme"
            onAction={onStart}
          />
        ) : (
          <>
            <div className="flex gap-2 max-[360px]:flex-col">
              <SearchField
                value={filters.query}
                onChange={(query) => setFilters((f) => ({ ...f, query }))}
                label="Search exercises"
              />
              <button
                type="button"
                className="press relative flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-surface-2 px-4 text-lg font-semibold"
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

            {shown.length === 0 && filters.saved && savedIds.length === 0 ? (
              <EmptyState
                illustration={<EmptySlots />}
                title="Nothing saved yet"
                body="Tap the bookmark on an exercise to keep it here."
                actionLabel={`Show all ${total} exercises`}
                onAction={() => setFilters(NO_FILTERS)}
              />
            ) : shown.length === 0 && !showAll && hiddenMatches > 0 ? (
              <EmptyState
                illustration={<EmptySlots />}
                title="Hidden by your limits"
                body={`${hiddenMatches} ${hiddenMatches === 1 ? 'exercise matches' : 'exercises match'}, but ${hiddenMatches === 1 ? 'it clashes' : 'they clash'} with ${limitNames}.`}
                actionLabel="Show them"
                onAction={() => setShowAll(true)}
              />
            ) : shown.length === 0 ? (
              <EmptyState
                illustration={<EmptySlots />}
                title="No exercises match"
                body="Try a different search, or remove a filter."
                actionLabel={`Show all ${total} exercises`}
                onAction={() => setFilters(NO_FILTERS)}
              />
            ) : (
              <ul className="m-0 flex list-none flex-col p-0" data-testid="exercise-list">
                {shown.map((e) => (
                  <ExerciseRow key={e.id} exercise={e} keyed showAttributes saved={savedIds.includes(e.id)} onOpen={onOpen} />
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
