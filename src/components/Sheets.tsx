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
  BAND_CHECK,
  bandConsequence,
  DUMBBELL_CHECK,
  dumbbellConsequence,
  PULLUP_CHECKS,
  STYLES,
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
      {answers.equipment.includes('dumbbells') && (
        <div className="mt-4 border-t border-line pt-4" data-testid="dumbbells-checks">
          <h3 className="font-display m-0 text-2xl font-semibold">About your dumbbells</h3>
          <p className="m-0 pt-1 pb-2 text-[15px] text-muted" data-testid="dumbbells-consequence" role="status">
            {dumbbellConsequence(answers.extras.heavy)}
          </p>
          <Switch
            checked={answers.extras.heavy}
            label={DUMBBELL_CHECK.label}
            onChange={(heavy) => onChange({ ...answers, extras: { ...answers.extras, heavy } })}
          />
        </div>
      )}
      {answers.equipment.includes('band') && (
        <div className="mt-4 border-t border-line pt-4" data-testid="band-checks">
          <h3 className="font-display m-0 text-2xl font-semibold">About your band</h3>
          <p className="m-0 pt-1 pb-2 text-[15px] text-muted" data-testid="band-consequence" role="status">
            {bandConsequence(answers.extras.anchor)}
          </p>
          <Switch
            checked={answers.extras.anchor}
            label={BAND_CHECK.label}
            onChange={(anchor) => onChange({ ...answers, extras: { ...answers.extras, anchor } })}
          />
        </div>
      )}
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
    <div role="group" aria-label={label} className="flex rounded-full bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`press h-12 min-w-16 rounded-full px-4 text-lg font-semibold ${value === o.id ? 'bg-(--tape) text-on-tape' : 'text-muted'}`}
        >
          {o.text}
        </button>
      ))}
    </div>
  )
}

/** Keeps digits and one decimal point, so "70 kg" pasted in becomes "70". */
function cleanDecimal(text: string): string {
  const t = text.replace(',', '.').replace(/[^0-9.]/g, '')
  const i = t.indexOf('.')
  return (i < 0 ? t : t.slice(0, i + 1) + t.slice(i + 1).replace(/\./g, '')).slice(0, 7)
}
const cleanDigits = (text: string) => text.replace(/[^0-9]/g, '').slice(0, 2)

const trim = (n: number, places = 1) => String(Number(n.toFixed(places)))
const weightShown = (kg: number, unit: Units['weight']) => trim(unit === 'kg' ? kg : kgToLb(kg))

const WEIGHT_LB = { min: Math.ceil(kgToLb(WEIGHT_KG.min)), max: Math.floor(kgToLb(WEIGHT_KG.max)) }

/** Optional weight and height. Typed in the unit the person chooses; the value is kept in kg and cm. */
export function BodySheet({ open, onOpenChange, answers, onChange, units, onUnits }: BodySheetProps) {
  const [weightText, setWeightText] = useState('')
  const [cmText, setCmText] = useState('')
  const [ftText, setFtText] = useState('')
  const [inText, setInText] = useState('')
  // The last good value, in kg and cm. A unit switch shows this again, so switching never drifts.
  const [kg, setKg] = useState<number | null>(null)
  const [cm, setCm] = useState<number | null>(null)
  // True while a field still shows the saved value, so a rounded display is never judged in place of it.
  const [weightFresh, setWeightFresh] = useState(true)
  const [heightFresh, setHeightFresh] = useState(true)

  const fill = (w: number | null, h: number | null, u: Units) => {
    setKg(w)
    setCm(h)
    setWeightFresh(true)
    setHeightFresh(true)
    setWeightText(w === null ? '' : weightShown(w, u.weight))
    setCmText(h === null ? '' : trim(h))
    const f = h === null ? null : cmToFtIn(h)
    setFtText(f ? String(f.ft) : '')
    setInText(f ? String(f.inch) : '')
  }

  // Fill the fields from the saved answers each time the sheet opens.
  useEffect(() => {
    if (open) fill(answers.weightKg, answers.heightCm, units)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const typedWeight = parseNumber(weightText)
  const weightKg = weightFresh && kg !== null ? kg : typedWeight === null ? null : units.weight === 'kg' ? typedWeight : lbToKg(typedWeight)
  const weightBad = weightText.trim() !== '' && !inRange(weightKg, WEIGHT_KG)

  const feet = parseNumber(ftText)
  const inches = inText.trim() === '' ? 0 : parseNumber(inText)
  const inchesBad = inches === null || inches > 11
  const heightCm =
    heightFresh && cm !== null
      ? cm
      : units.height === 'cm'
        ? parseNumber(cmText)
        : feet === null || inchesBad
          ? null
          : ftInToCm(feet, inches as number)
  const heightTyped = units.height === 'cm' ? cmText.trim() !== '' : ftText.trim() !== '' || inText.trim() !== ''
  const heightBad = heightTyped && !inRange(heightCm, HEIGHT_CM)
  const canSave = !weightBad && !heightBad

  const weightRange = units.weight === 'kg' ? '20 and 300 kg' : `${WEIGHT_LB.min} and ${WEIGHT_LB.max} lb`
  const heightRange = units.height === 'cm' ? '100 and 250 cm' : '3 ft 4 in and 8 ft 2 in'
  const hintClass = (bad: boolean) => `m-0 text-[15px] ${bad ? 'font-semibold text-ink' : 'text-muted'}`

  const changeWeight = (text: string) => {
    setWeightFresh(false)
    const t = cleanDecimal(text)
    setWeightText(t)
    const n = parseNumber(t)
    setKg(n === null ? null : units.weight === 'kg' ? n : lbToKg(n))
  }
  const changeCm = (text: string) => {
    setHeightFresh(false)
    const t = cleanDecimal(text)
    setCmText(t)
    setCm(parseNumber(t))
  }
  const changeFtIn = (ft: string, inch: string) => {
    setHeightFresh(false)
    setFtText(ft)
    setInText(inch)
    const f = parseNumber(ft)
    const i = inch === '' ? 0 : parseNumber(inch)
    setCm(f === null || i === null || i > 11 ? null : ftInToCm(f, i))
  }

  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Your weight and height"
      compactWhenShort
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
                // Show the same weight in the new unit, from the saved kg value and not from rounded text.
                if (kg !== null && !weightBad) {
                  setWeightText(weightShown(kg, weight))
                  setWeightFresh(true)
                }
                onUnits({ ...units, weight })
              }}
            />
          </div>
          <input
            id="body-weight"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={weightText}
            onChange={(e) => changeWeight(e.target.value)}
            aria-invalid={weightBad}
            aria-describedby="body-weight-hint"
            placeholder={units.weight}
            className={fieldClass}
            data-testid="body-weight"
          />
          <p id="body-weight-hint" className={hintClass(weightBad)} aria-live="polite">
            {weightBad ? `Enter a weight between ${weightRange}, or clear the box.` : `Between ${weightRange}.`}
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
                if (cm !== null && !heightBad) {
                  const f = cmToFtIn(cm)
                  setCmText(trim(cm))
                  setFtText(String(f.ft))
                  setInText(String(f.inch))
                  setHeightFresh(true)
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
              value={cmText}
              onChange={(e) => changeCm(e.target.value)}
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
                value={ftText}
                onChange={(e) => changeFtIn(cleanDigits(e.target.value).slice(0, 1), inText)}
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
                value={inText}
                onChange={(e) => changeFtIn(ftText, cleanDigits(e.target.value))}
                aria-label="Inches"
                aria-invalid={heightBad}
                aria-describedby="body-height-hint"
                placeholder="in"
                className={fieldClass}
                data-testid="body-inches"
              />
            </div>
          )}
          <p id="body-height-hint" className={hintClass(heightBad)} aria-live="polite">
            {heightBad
              ? units.height === 'ft' && inchesBad
                ? 'Inches go from 0 to 11.'
                : `Enter a height between ${heightRange}, or clear the box.`
              : `Between ${heightRange}.`}
          </p>
        </div>
      </div>
    </AnswerSheet>
  )
}

export function StyleSheet({ open, onOpenChange, answers, onChange }: SheetProps) {
  const toggle = (id: string) => {
    const has = answers.styles.includes(id)
    onChange({ ...answers, styles: has ? answers.styles.filter((x) => x !== id) : [...answers.styles, id] })
  }
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title="What do you like training?"
      lead="Tap in order, favourite first."
      why="Optional. Your order can change which programme we suggest."
      saveLabel="Save training style"
    >
      <div role="group" aria-label="Training styles">
        {STYLES.map((st) => {
          const rank = answers.styles.indexOf(st.id) + 1
          return (
            <OptionRow
              key={st.id}
              role="checkbox"
              checked={rank > 0}
              rank={rank > 0 ? rank : undefined}
              label={st.label}
              detail={st.detail}
              onClick={() => toggle(st.id)}
            />
          )
        })}
      </div>
    </AnswerSheet>
  )
}
