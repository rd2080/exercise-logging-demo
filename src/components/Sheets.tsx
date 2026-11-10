import { useEffect, useRef } from 'react'
import {
  ACTIVITY,
  EQUIPMENT,
  GOALS,
  LIMITS,
  MAX_GOALS,
  PULLUP_CHECKS,
  pullupConsequence,
  type Answers,
} from '../onboarding'
import { AnswerSheet } from './AnswerSheet'
import { OptionRow } from './OptionRow'
import { Switch } from './Switch'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answers: Answers
  onChange: (next: Answers) => void
}

export function GoalsSheet({ open, onOpenChange, answers, onChange }: SheetProps) {
  const full = answers.goals.length >= MAX_GOALS
  const toggle = (id: string) => {
    const has = answers.goals.includes(id)
    onChange({
      ...answers,
      goals: has ? answers.goals.filter((g) => g !== id) : [...answers.goals, id],
    })
  }
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="What are your goals?"
      why="Your goals decide which programmes we suggest. Choose up to three, most important first."
      saveLabel="Save goals"
      canSave={answers.goals.length > 0}
    >
      <div role="group" aria-label="Goals">
        {GOALS.map((g) => {
          const rank = answers.goals.indexOf(g.id) + 1
          return (
            <OptionRow
              key={g.id}
              role="checkbox"
              checked={rank > 0}
              rank={rank > 0 ? rank : undefined}
              disabled={full && rank === 0}
              label={g.label}
              onClick={() => toggle(g.id)}
            />
          )
        })}
      </div>
      {full && <p className="m-0 pt-2 text-[15px] text-muted">That is three. Remove one to pick another.</p>}
    </AnswerSheet>
  )
}

export function ActivitySheet({ open, onOpenChange, answers, onChange }: SheetProps) {
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="How active are you now?"
      lead="Pick what is true this month, not what you want to be true."
      why="This sets how hard your first weeks start."
    >
      <div role="radiogroup" aria-label="Activity level">
        {ACTIVITY.map((a) => (
          <OptionRow
            key={a.id}
            role="radio"
            checked={answers.activity === a.id}
            label={a.label}
            detail={a.detail}
            onClick={() => {
              onChange({ ...answers, activity: a.id })
              onOpenChange(false)
            }}
          />
        ))}
      </div>
    </AnswerSheet>
  )
}

export function EquipmentSheet({ open, onOpenChange, answers, onChange }: SheetProps) {
  const hasPullup = answers.equipment.includes('pullup')
  const checksRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (hasPullup) checksRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [hasPullup])
  const pick = (id: string) => {
    let equipment: string[]
    if (id === 'none') equipment = answers.equipment.includes('none') ? [] : ['none']
    else {
      const without = answers.equipment.filter((e) => e !== 'none')
      equipment = without.includes(id) ? without.filter((e) => e !== id) : [...without, id]
    }
    onChange({ ...answers, equipment })
  }
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="What equipment do you have?"
      lead="Count only what you can reach today."
      why="We only plan exercises you can actually do."
      saveLabel="Save equipment"
      canSave={answers.equipment.length > 0}
    >
      <div role="group" aria-label="Equipment">
        {EQUIPMENT.map((e) => (
          <OptionRow
            key={e.id}
            role="checkbox"
            checked={answers.equipment.includes(e.id)}
            label={e.label}
            onClick={() => pick(e.id)}
          />
        ))}
      </div>
      {hasPullup && (
        <div ref={checksRef} className="mt-4 border-t border-line pt-4" data-testid="pullup-checks">
          <h3 className="font-display m-0 text-2xl font-semibold">About your pull-up bar</h3>
          <p className="m-0 pt-1 pb-2 text-[15px] text-muted" data-testid="pullup-consequence" role="status">
            {pullupConsequence(answers.pullup)}
          </p>
          {PULLUP_CHECKS.map((c) => {
            const key = c.id as 'hang' | 'secure'
            return (
              <Switch
                key={c.id}
                checked={answers.pullup[key]}
                label={c.label}
                onChange={(next) =>
                  onChange({ ...answers, pullup: { ...answers.pullup, [key]: next } })
                }
              />
            )
          })}
        </div>
      )}
    </AnswerSheet>
  )
}

export function LimitsSheet({ open, onOpenChange, answers, onChange }: SheetProps) {
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Any limits we should know about?"
      lead="Skip this if nothing applies."
      why="Optional. Switch on anything that rules exercises out."
      saveLabel="Save limits"
    >
      <div role="group" aria-label="Limits">
        {LIMITS.map((l) => (
          <Switch
            key={l.id}
            checked={answers.limits.includes(l.id)}
            label={l.label}
            detail={l.detail}
            onChange={(next) =>
              onChange({
                ...answers,
                limits: next ? [...answers.limits, l.id] : answers.limits.filter((x) => x !== l.id),
              })
            }
          />
        ))}
      </div>
    </AnswerSheet>
  )
}
