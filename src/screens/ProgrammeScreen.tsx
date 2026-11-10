import { ArrowLeft } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { Slot } from '../components/Slot'
import { PROGRAMMES, recommended, summaryText, type Answers } from '../onboarding'

interface ProgrammeScreenProps {
  answers: Answers
  onBack: () => void
  onStart: (programmeId: string) => void
}

export function ProgrammeScreen({ answers, onBack, onStart }: ProgrammeScreenProps) {
  const best = recommended(answers)
  const [selected, setSelected] = useState(best)
  const chosen = PROGRAMMES.find((p) => p.id === selected)!
  const recap = [
    summaryText(answers, 'goals'),
    summaryText(answers, 'activity'),
    summaryText(answers, 'equipment'),
    summaryText(answers, 'limits') === 'No limits' ? null : summaryText(answers, 'limits'),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="programmes"
    >
      <main className="flex flex-1 flex-col gap-5 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-40 short:gap-3 short:pb-32">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label="Back to set up"
          onClick={onBack}
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance short:text-[30px]">
            Choose your programme
          </h1>
          <p className="m-0 text-[17px] text-muted" data-testid="recap">
            {recap}
          </p>
        </header>

        <div role="radiogroup" aria-label="Programme" className="flex flex-col">
          {PROGRAMMES.map((p) => {
            const on = selected === p.id
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSelected(p.id)}
                className={`press flex flex-col gap-3 border-t border-line py-4 text-left first:border-t-0 ${on ? 'bg-surface' : ''} -mx-4 px-4`}
              >
                <span className="flex items-center gap-3">
                  <Slot n={0} filled={on} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-[28px] leading-tight font-semibold">{p.name}</span>
                    <span className="num text-[17px] text-muted">
                      {p.weeks} weeks · {p.perWeek} sessions a week · {p.needs}
                    </span>
                  </span>
                </span>
                {p.id === best && (
                  <span className="w-fit rounded-full bg-surface-2 px-3 py-1 text-[15px] font-semibold">
                    Recommended for you
                  </span>
                )}
                <span className="text-lg leading-snug">{p.summary}</span>
                <span
                  className="flex gap-1"
                  style={{ '--cut': '5px' } as CSSProperties}
                  aria-label={`${p.weeks} weeks`}
                  role="img"
                >
                  {Array.from({ length: p.weeks }, (_, w) => (
                    <span
                      key={w}
                      className={`tape-cut h-3 flex-1 ${on ? 'tape-fill' : 'bg-surface-2'}`}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] short:pt-3 short:pb-3">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
          onClick={() => onStart(chosen.id)}
          data-testid="start-programme"
        >
          Start {chosen.name.toLowerCase()}
        </button>
      </footer>
    </div>
  )
}
