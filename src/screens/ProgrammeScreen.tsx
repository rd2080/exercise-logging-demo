import { ArrowLeft } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { Slot } from '../components/Slot'
import { PROGRAMMES, recommended, summaryText, type Answers, type Programme } from '../onboarding'

interface ProgrammeScreenProps {
  answers: Answers
  onBack: () => void
  onStart: (programmeId: string) => void
}

const MAX_WEEKS = Math.max(...PROGRAMMES.map((p) => p.weeks))

/** One weekly segment per week, all the same width, so 8 weeks is twice as long as 4. */
function WeekStrip({ programme, on }: { programme: Programme; on: boolean }) {
  const reduce = useReducedMotion()
  const segments = Array.from({ length: programme.weeks }, (_, w) => w)
  const row = (fill: boolean) => (
    <span className="flex gap-1" style={{ width: `${(programme.weeks / MAX_WEEKS) * 100}%` }}>
      {segments.map((w) => (
        <span key={w} className={`tape-cut h-3 flex-1 ${fill ? 'tape-fill' : 'bg-surface-2'}`} />
      ))}
    </span>
  )
  return (
    <span
      className="relative block"
      style={{ '--cut': '5px' } as CSSProperties}
      role="img"
      aria-label={`${programme.weeks} weeks`}
    >
      {row(false)}
      {on && (
        <motion.span
          key="roll"
          className="absolute inset-0 block"
          initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -6% 100%, 0% 100%)' }}
          animate={{ clipPath: 'polygon(0% 0%, 106% 0%, 100% 100%, 0% 100%)' }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {row(true)}
        </motion.span>
      )}
    </span>
  )
}

export function ProgrammeScreen({ answers, onBack, onStart }: ProgrammeScreenProps) {
  const best = recommended(answers)
  const [selected, setSelected] = useState(best.id)
  const chosen = PROGRAMMES.find((p) => p.id === selected)!
  const others = [summaryText(answers, 'activity'), summaryText(answers, 'equipment')]
  if (answers.limits.length) others.push(summaryText(answers, 'limits'))

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
          <div className="text-[17px] text-muted" data-testid="recap">
            <p className="m-0">{summaryText(answers, 'goals')}</p>
            <p className="m-0">{others.join(' · ')}</p>
          </div>
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
                className={`press -mx-4 flex flex-col gap-3 border-t border-line px-4 py-4 text-left first:border-t-0 ${on ? 'bg-surface' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Slot n={0} filled={on} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-[28px] leading-tight font-semibold">{p.name}</span>
                    <span className="num text-[17px] text-muted">
                      {p.weeks} weeks · {p.perWeek} sessions a week
                    </span>
                    <span className="text-[17px] text-muted">{p.needs}</span>
                  </span>
                </span>
                {p.id === best.id && (
                  <span className="w-fit rounded-2xl bg-surface-2 px-3 py-1.5 text-[15px] font-semibold">
                    Recommended for you. {best.reason}.
                  </span>
                )}
                <span className="text-lg leading-snug">{p.summary}</span>
                <WeekStrip programme={p} on={on} />
              </button>
            )
          })}
        </div>
        <p className="m-0 text-[15px] text-muted">Sample programmes for this demo.</p>
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
