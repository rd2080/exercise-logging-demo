import { ArrowLeft } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { OptionRow } from '../components/OptionRow'
import { SearchField } from '../components/SearchField'
import { SKILL_CLASSES, SKILLS, matchesSkill } from '../lib/skills'

interface SkillsScreenProps {
  /** The skill already picked, if any. */
  current: string | null
  /** Where the back button leads, named for screen readers ("Back to set up", "Back to the Skill tab"). */
  backLabel: string
  onBack: () => void
  onContinue: (id: string) => void
}

/** The list of skills, grouped by kind, with a search box and kind chips on top. One can be picked. */
export function SkillsScreen({ current, backLabel, onBack, onContinue }: SkillsScreenProps) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<string | null>(null)
  const [choice, setChoice] = useState<string | null>(current)

  const shown = useMemo(
    () => SKILLS.filter((s) => (!kind || s.classification === kind) && matchesSkill(s, query)),
    [kind, query],
  )
  const groups = SKILL_CLASSES.map((c) => ({ ...c, skills: shown.filter((s) => s.classification === c.id) })).filter(
    (g) => g.skills.length > 0,
  )

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col"
      style={{ '--tape': 'var(--color-tape-reps)' } as CSSProperties}
      data-testid="skills"
    >
      <main className="flex flex-1 flex-col gap-4 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-40">
        <button
          type="button"
          className="press grid size-12 place-items-center rounded-full bg-surface-2"
          aria-label={backLabel}
          onClick={onBack}
          data-testid="skills-back"
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance">Choose a skill</h1>
          <p className="m-0 text-lg text-muted" role="status" data-testid="skills-count">
            {shown.length} {shown.length === 1 ? 'skill' : 'skills'}
          </p>
        </header>

        <div className="flex">
          <SearchField value={query} onChange={setQuery} label="Search skills" />
        </div>
        <div role="group" aria-label="Kind of skill" className="flex flex-wrap gap-2">
          {[{ id: null, label: 'All' }, ...SKILL_CLASSES].map((c) => (
            <button
              key={c.id ?? 'all'}
              type="button"
              aria-pressed={kind === c.id}
              onClick={() => setKind(c.id)}
              className={`press h-12 rounded-full px-4 text-lg font-semibold ${
                kind === c.id ? 'bg-ink text-on-tape' : 'border-2 border-line text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {SKILLS.length === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No skills yet"
            body="Skills will be listed here as they are added."
            actionLabel="Go back"
            onAction={onBack}
          />
        ) : groups.length === 0 ? (
          <EmptyState
            illustration={<EmptySlots />}
            title="No skills match"
            body="Try a different search, or pick another kind."
            actionLabel="Show all skills"
            onAction={() => {
              setQuery('')
              setKind(null)
            }}
          />
        ) : (
          <div role="radiogroup" aria-label="Skills" className="flex flex-col gap-4" data-testid="skill-list">
            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`kind-${g.id}`} className="flex flex-col">
                <h2 id={`kind-${g.id}`} className="font-display m-0 text-xl leading-tight font-semibold text-muted">
                  {g.label}
                </h2>
                {g.skills.map((s) => (
                  <OptionRow
                    key={s.id}
                    role="radio"
                    checked={choice === s.id}
                    label={s.label}
                    detail={`${s.detail}\n${s.programmeId ? 'Programme ready' : 'Programme coming soon'}`}
                    onClick={() => setChoice(s.id)}
                  />
                ))}
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[480px] border-t border-line bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape disabled:bg-surface-2 disabled:text-muted short:h-14"
          disabled={!choice}
          onClick={() => choice && onContinue(choice)}
          data-testid="skills-continue"
        >
          {choice ? 'Choose this skill' : 'Pick a skill to continue'}
        </button>
      </footer>
    </div>
  )
}
