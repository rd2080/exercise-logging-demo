import { ChevronRight } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { Slot } from '../components/Slot'
import { ActivitySheet, EquipmentSheet, GoalsSheet, LimitsSheet } from '../components/Sheets'
import { missing, summaryText, type Answers, type RowId } from '../onboarding'

interface SetupScreenProps {
  answers: Answers
  onChange: (next: Answers) => void
  onCreate: () => void
}

const ROWS: { id: RowId; label: string; why: string; sheet: string }[] = [
  { id: 'goals', label: 'Goals', why: 'Decides which programmes we suggest', sheet: 'Choose goals' },
  { id: 'activity', label: 'Activity level', why: 'Sets how hard your first weeks start', sheet: 'Choose activity level' },
  { id: 'equipment', label: 'Equipment', why: 'So we only plan what you can do', sheet: 'Choose equipment' },
  { id: 'limits', label: 'Limits', why: 'Optional. Rules exercises out', sheet: 'Choose limits' },
]

export function SetupScreen({ answers, onChange, onCreate }: SetupScreenProps) {
  const [open, setOpen] = useState<RowId | null>(null)
  const need = missing(answers)
  const ready = need.length === 0
  const sheetProps = (id: RowId) => ({
    open: open === id,
    onOpenChange: (o: boolean) => setOpen(o ? id : null),
    answers,
    onChange,
  })

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="setup"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-48 short:gap-4 short:pt-4 short:pb-44">
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold text-balance short:text-[32px]">
            Set up your plan
          </h1>
          <p className="m-0 text-lg text-muted">Four answers, about a minute.</p>
        </header>

        <ul className="m-0 flex list-none flex-col p-0">
          {ROWS.map((row, i) => {
            const value = summaryText(answers, row.id)
            const filled = row.id === 'limits' ? answers.limits.length > 0 : value !== null
            return (
              <li key={row.id} className="border-t border-line first:border-t-0">
                <button
                  type="button"
                  className="press flex min-h-[88px] w-full items-center gap-3 py-3 text-left short:min-h-[76px]"
                  aria-label={`${row.sheet}. ${value ?? 'Not answered'}`}
                  onClick={() => setOpen(row.id)}
                >
                  <Slot n={i + 1} filled={filled} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-display text-2xl leading-tight font-semibold">{row.label}</span>
                    <span className="text-[15px] text-muted">{row.why}</span>
                    <span
                      className={`truncate text-lg ${value ? 'text-ink' : 'font-semibold text-(--tape)'}`}
                      data-testid={`answer-${row.id}`}
                    >
                      {value ?? 'Choose'}
                    </span>
                  </span>
                  <ChevronRight size={24} className="shrink-0 text-muted" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="m-0 pb-3 text-[15px] text-muted" data-testid="still-needed" role="status">
          {ready ? 'All set. Your plan is ready to build.' : `Still needed: ${need.join(', ')}.`}
        </p>
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape disabled:bg-surface-2 disabled:text-muted short:h-14"
          disabled={!ready}
          onClick={onCreate}
          data-testid="create-plan"
        >
          Create my plan
        </button>
      </footer>

      <GoalsSheet {...sheetProps('goals')} />
      <ActivitySheet {...sheetProps('activity')} />
      <EquipmentSheet {...sheetProps('equipment')} />
      <LimitsSheet {...sheetProps('limits')} />
    </div>
  )
}
