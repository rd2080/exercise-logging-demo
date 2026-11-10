import { useEffect, useRef, useState } from 'react'
import {
  cmToFtIn,
  ftInToCm,
  HEIGHT_CM,
  inRange,
  kgToLb,
  lbToKg,
  parseNumber,
  WEIGHT_KG,
  type Units,
} from '../lib/body'
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

interface BodySheetProps extends SheetProps {
  units: Units
  onUnits: (next: Units) => void
}

const fieldClass =
  'h-14 w-full min-w-0 rounded-2xl bg-surface-2 px-4 text-xl text-ink tabular-nums placeholder:text-muted aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ink'

function UnitToggle<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; text: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`press h-12 min-w-16 rounded-full px-4 text-lg font-semibold ${value === o.id ? 'bg-(--tape) text-on-tape' : 'text-muted'}`}
        >
          {o.text}
        </button>
      ))}
    </div>
  )
}

/** Optional weight and height. Typed in the unit the person chooses, kept in kg and cm. */
export function BodySheet({ open, onOpenChange, answers, onChange, units, onUnits }: BodySheetProps) {
  const [weightText, setWeightText] = useState('')
  const [cmText, setCmText] = useState('')
  const [ftText, setFtText] = useState('')
  const [inText, setInText] = useState('')

  // Fill the fields from the saved answers each time the sheet opens.
  useEffect(() => {
    if (!open) return
    const w = answers.weightKg
    setWeightText(w === null ? '' : String(Math.round(units.weight === 'kg' ? w : kgToLb(w))))
    const h = answers.heightCm
    setCmText(h === null ? '' : String(Math.round(h)))
    const f = h === null ? null : cmToFtIn(h)
    setFtText(f ? String(f.ft) : '')
    setInText(f ? String(f.inch) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const weightN = parseNumber(weightText)
  const weightKg = weightN === null ? null : units.weight === 'kg' ? weightN : lbToKg(weightN)
  const weightBad = weightText.trim() !== '' && !inRange(weightKg, WEIGHT_KG)

  const heightCm = (() => {
    if (units.height === 'cm') return parseNumber(cmText)
    const ft = parseNumber(ftText)
    const inch = parseNumber(inText) ?? 0
    return ft === null ? null : ftInToCm(ft, inch)
  })()
  const heightTyped = units.height === 'cm' ? cmText.trim() !== '' : ftText.trim() !== '' || inText.trim() !== ''
  const heightBad = heightTyped && !inRange(heightCm, HEIGHT_CM)
  const canSave = !weightBad && !heightBad

  const weightRange = units.weight === 'kg' ? '20 to 300 kg' : '45 to 660 lb'
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Your weight and height"
      lead="Leave either blank if you would rather not say."
      why="Optional. These stay on this device."
      saveLabel="Save measurements"
      canSave={canSave}
      onSave={() =>
        onChange({
          ...answers,
          weightKg: weightBad || weightKg === null ? null : weightKg,
          heightCm: heightBad || heightCm === null ? null : heightCm,
        })
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="body-weight" className="text-xl font-semibold">
              Weight
            </label>
            <UnitToggle
              label="Weight unit"
              value={units.weight}
              options={[
                { id: 'kg', text: 'kg' },
                { id: 'lb', text: 'lb' },
              ]}
              onChange={(weight) => {
                // Convert what is typed so the same weight shows in the new unit.
                if (weightKg !== null && !weightBad)
                  setWeightText(String(Math.round(weight === 'kg' ? weightKg : kgToLb(weightKg))))
                onUnits({ ...units, weight })
              }}
            />
          </div>
          <input
            id="body-weight"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            maxLength={5}
            value={weightText}
            onChange={(e) => setWeightText(e.target.value)}
            aria-invalid={weightBad}
            aria-describedby="body-weight-hint"
            placeholder={units.weight}
            className={fieldClass}
            data-testid="body-weight"
          />
          <p id="body-weight-hint" className="m-0 text-[15px] text-muted" role={weightBad ? 'alert' : undefined}>
            {weightBad ? `Enter a weight from ${weightRange}, or clear the box.` : `Between ${weightRange}.`}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={units.height === 'cm' ? 'body-cm' : 'body-ft'} className="text-xl font-semibold">
              Height
            </label>
            <UnitToggle
              label="Height unit"
              value={units.height}
              options={[
                { id: 'cm', text: 'cm' },
                { id: 'ft', text: 'ft' },
              ]}
              onChange={(height) => {
                if (heightCm !== null && !heightBad) {
                  const f = cmToFtIn(heightCm)
                  setCmText(String(Math.round(heightCm)))
                  setFtText(String(f.ft))
                  setInText(String(f.inch))
                }
                onUnits({ ...units, height })
              }}
            />
          </div>
          {units.height === 'cm' ? (
            <input
              id="body-cm"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={5}
              value={cmText}
              onChange={(e) => setCmText(e.target.value)}
              aria-invalid={heightBad}
              aria-describedby="body-height-hint"
              placeholder="cm"
              className={fieldClass}
              data-testid="body-height"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input
                id="body-ft"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={1}
                value={ftText}
                onChange={(e) => setFtText(e.target.value)}
                aria-label="Feet"
                aria-invalid={heightBad}
                aria-describedby="body-height-hint"
                placeholder="ft"
                className={fieldClass}
                data-testid="body-height"
              />
              <input
                id="body-in"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={2}
                value={inText}
                onChange={(e) => setInText(e.target.value)}
                aria-label="Inches"
                aria-invalid={heightBad}
                aria-describedby="body-height-hint"
                placeholder="in"
                className={fieldClass}
                data-testid="body-inches"
              />
            </div>
          )}
          <p id="body-height-hint" className="m-0 text-[15px] text-muted" role={heightBad ? 'alert' : undefined}>
            {heightBad
              ? `Enter a height from ${units.height === 'cm' ? '100 to 250 cm' : '3 ft 4 in to 8 ft 2 in'}, or clear the box.`
              : `Between ${units.height === 'cm' ? '100 and 250 cm' : '3 ft 4 in and 8 ft 2 in'}.`}
          </p>
        </div>
      </div>
    </AnswerSheet>
  )
}
