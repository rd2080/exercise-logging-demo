import { ArrowLeft } from 'lucide-react'
import type { CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { classLabel, type Skill } from '../lib/skills'

interface SkillConfirmScreenProps {
  skill: Skill | undefined
  onBack: () => void
  /** The choice is saved either way; `adjust` says whether exercises may be changed for it. */
  onDecide: (adjust: boolean) => void
}

/** Asks for permission before the exercises are changed for the skill. */
export function SkillConfirmScreen({ skill, onBack, onDecide }: SkillConfirmScreenProps) {
  const shell = 'mx-auto flex min-h-dvh w-full max-w-[480px] flex-col'
  const tape = { '--tape': 'var(--color-tape-reps)' } as CSSProperties
  if (!skill) {
    return (
      <div className={shell} style={tape} data-testid="skill-confirm">
        <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-28">
          <EmptyState
            illustration={<EmptySlots />}
            title="No skill chosen"
            body="Pick a skill first, then come back to confirm."
            actionLabel="Choose a skill"
            onAction={onBack}
          />
        </main>
      </div>
    )
  }
  return (
    <div className={shell} style={tape} data-testid="skill-confirm">
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-56">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label="Back to the skill list"
          onClick={onBack}
          data-testid="confirm-back"
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <header className="flex flex-col gap-3">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance [overflow-wrap:anywhere]">
            Add steps toward {skill.label.toLowerCase()}?
          </h1>
          <p className="m-0 text-lg text-pretty text-muted">
            Can we adjust your exercises to include progress toward this skill? You can change this any time in the
            Skill tab.
          </p>
        </header>
        <div className="flex flex-col gap-1 border-y border-line py-4" data-testid="chosen-skill">
          <p className="m-0 text-[17px] text-muted">{classLabel(skill.classification)}</p>
          <p className="font-display m-0 text-2xl leading-tight font-semibold [overflow-wrap:anywhere]">{skill.label}</p>
          <p className="m-0 text-[17px] text-pretty text-muted [overflow-wrap:anywhere]">{skill.detail}</p>
        </div>
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] flex-col gap-3 border-t border-line bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
          onClick={() => onDecide(true)}
          data-testid="skill-adjust"
        >
          Adjust my exercises
        </button>
        <button
          type="button"
          className="press h-14 w-full rounded-full text-xl font-semibold"
          onClick={() => onDecide(false)}
          data-testid="skill-keep"
        >
          Keep my exercises as they are
        </button>
      </footer>
    </div>
  )
}
