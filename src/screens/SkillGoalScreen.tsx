import { ArrowLeft } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { EmptyState } from '../components/EmptyState'
import { EmptySlots } from '../components/EmptySlots'
import { OptionRow } from '../components/OptionRow'
import { SKILL_GOALS, type Answers } from '../onboarding'

interface SkillGoalScreenProps {
  answers: Answers
  onChange: (next: Answers) => void
  /** Back to set up, with or without a change. */
  onBack: () => void
}

/**
 * A page of its own for picking one skill to work toward. The choice picks the programme that is
 * recommended, and later the exercises suggested. More skills are added to the fixture list.
 */
export function SkillGoalScreen({ answers, onChange, onBack }: SkillGoalScreenProps) {
  const [choice, setChoice] = useState<string | null>(answers.skillGoal)
  const save = () => {
    onChange({ ...answers, skillGoal: choice })
    onBack()
  }
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="skill-goal"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-40">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label="Back to set up"
          onClick={onBack}
          data-testid="skill-back"
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance">Pick a skill goal</h1>
          <p className="m-0 text-lg text-pretty text-muted">
            Optional. A skill to aim for changes the programme we suggest and, later, the exercises.
          </p>
        </header>

        {SKILL_GOALS.length === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No skill goals yet"
            body="Skill goals will be listed here as they are added."
            actionLabel="Back to set up"
            onAction={onBack}
          />
        ) : (
          <div role="radiogroup" aria-label="Skill goal">
            <OptionRow
              role="radio"
              checked={choice === null}
              label="No skill goal right now"
              onClick={() => setChoice(null)}
            />
            {SKILL_GOALS.map((s) => (
              <OptionRow
                key={s.id}
                role="radio"
                checked={choice === s.id}
                label={s.label}
                detail={s.detail}
                onClick={() => setChoice(s.id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
          onClick={save}
          data-testid="skill-save"
        >
          Save skill goal
        </button>
      </footer>
    </div>
  )
}
