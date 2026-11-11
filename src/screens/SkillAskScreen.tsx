import { ArrowLeft } from 'lucide-react'
import type { CSSProperties } from 'react'

interface SkillAskScreenProps {
  onChoose: () => void
  onSkip: () => void
  onBack: () => void
}

/** Right after the basics of the plan: a skill to aim for is offered, never required. */
export function SkillAskScreen({ onChoose, onSkip, onBack }: SkillAskScreenProps) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="skill-ask"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-56">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label="Back to set up"
          onClick={onBack}
          data-testid="skill-ask-back"
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <header className="flex flex-col gap-3">
          <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold text-balance">Want to learn a skill?</h1>
          <p className="m-0 text-lg text-pretty text-muted">
            Pick something to work toward, like a first pull-up or a handstand push-up. We can add steps toward it to
            your plan. You can skip this and add one later from the Skill tab.
          </p>
        </header>
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] flex-col gap-3 border-t border-line bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape short:h-14"
          onClick={onChoose}
          data-testid="skill-yes"
        >
          Choose a skill
        </button>
        <button
          type="button"
          className="press h-14 w-full rounded-full text-xl font-semibold"
          onClick={onSkip}
          data-testid="skill-no"
        >
          Not now
        </button>
      </footer>
    </div>
  )
}
