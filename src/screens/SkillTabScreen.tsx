import { useState, type CSSProperties } from 'react'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { Switch } from '../components/Switch'
import { classLabel, type Skill, type SkillChoice } from '../lib/skills'

interface SkillTabScreenProps {
  skill: Skill | undefined
  choice: SkillChoice | null
  onChoose: () => void
  onAdjust: (adjust: boolean) => void
  onRemove: () => void
}

/** The one skill goal: what it is, whether exercises are adjusted for it, and ways to change or remove it. */
export function SkillTabScreen({ skill, choice, onChoose, onAdjust, onRemove }: SkillTabScreenProps) {
  const [removing, setRemoving] = useState(false)
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="skill-tab"
    >
      <main className="flex flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
        <h1 className="font-display m-0 text-[40px] leading-[1.05] font-bold">Skill goal</h1>

        {!skill || !choice ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No skill goal yet"
            body="Pick a skill to work toward, like a first pull-up. We can add steps toward it to your exercises."
            actionLabel="Choose a skill goal"
            onAction={onChoose}
          />
        ) : (
          <>
            <section className="flex flex-col gap-2" aria-labelledby="skill-name" data-testid="current-skill">
              <p className="m-0 text-[17px] text-muted">{classLabel(skill.classification)}</p>
              <h2 id="skill-name" className="font-display m-0 text-[32px] leading-[1.1] font-bold [overflow-wrap:anywhere]">
                {skill.label}
              </h2>
              <p className="m-0 text-lg text-pretty text-muted [overflow-wrap:anywhere]">{skill.detail}</p>
              <p className="m-0 text-[17px] text-muted">
                {skill.programmeId ? 'A programme is ready for this skill.' : 'A programme for this skill is coming soon.'}
              </p>
            </section>

            <section className="flex flex-col" aria-label="Exercises">
              <Switch
                checked={choice.adjust}
                label="Adjust my exercises for this skill"
                detail={
                  choice.adjust
                    ? 'Saved. Your exercises will include steps toward this skill once that is built.'
                    : 'Off. Your exercises are not changed for this skill.'
                }
                onChange={onAdjust}
              />
            </section>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="press h-14 w-full rounded-full bg-surface-2 text-xl font-semibold"
                onClick={onChoose}
                data-testid="change-skill"
              >
                Change skill goal
              </button>
              <button
                type="button"
                className="press h-14 w-full rounded-full text-xl font-semibold"
                onClick={() => setRemoving(true)}
                data-testid="remove-skill"
              >
                Remove skill goal
              </button>
            </div>
            <ConfirmSheet
              open={removing}
              onOpenChange={setRemoving}
              title="Remove your skill goal?"
              why={`${skill.label} is removed as your goal. Your logged sets stay.`}
              confirmLabel="Remove skill goal"
              onConfirm={onRemove}
              destructive
              testId="remove-confirm"
            />
          </>
        )}
      </main>
    </div>
  )
}
