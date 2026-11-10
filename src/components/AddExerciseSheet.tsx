import { ChevronRight, History } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MAX_NAME, TYPE_CHOICES, suggest, type Entry } from '../entries'
import { SOURCE_NOTE, TYPE_META, targetText } from '../lib/tracking'
import type { Exercise, PrefillSource, SetValues, TrackingType } from '../types'
import { AnswerSheet } from './AnswerSheet'
import { DemoFigure } from './DemoFigure'
import { OptionRow } from './OptionRow'
import { SetFields } from './SetFields'

type Step = 'pick' | 'custom' | 'log'

interface AddExerciseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Exercise[]
  entries: Entry[]
  onAdd: (entry: Omit<Entry, 'id'>) => void
  /** Open straight on the log step for this exercise. */
  initialExercise?: Exercise
}

/** Pick what you did, confirm the prefilled numbers, log it. Closes on Log set. */
export function AddExerciseSheet({ open, onOpenChange, plan, entries, onAdd, initialExercise }: AddExerciseSheetProps) {
  const [step, setStep] = useState<Step>('pick')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<TrackingType>('reps')
  const [values, setValues] = useState<SetValues>({})
  const [source, setSource] = useState<PrefillSource>('default')
  const saved = useRef(false)

  // Start from the first step each time the sheet opens.
  useLayoutEffect(() => {
    if (open) {
      saved.current = false
      if (initialExercise) {
        const s = suggest(initialExercise.name, initialExercise.trackingType, initialExercise, entries)
        setExercise(initialExercise)
        setName(initialExercise.name)
        setType(initialExercise.trackingType)
        setValues(s.values)
        setSource(s.source)
        setStep('log')
        return
      }
      setStep('pick')
      setExercise(null)
      setName('')
      setType('reps')
    }
  }, [open])

  // Move focus to the new step's title so keyboard and screen reader users land in the right place.
  const first = useRef(true)
  useEffect(() => {
    if (!open) {
      first.current = true
      return
    }
    if (first.current) {
      first.current = false
      return
    }
    const id = requestAnimationFrame(() => document.getElementById('sheet-title')?.focus())
    return () => cancelAnimationFrame(id)
  }, [step, open])

  const goLog = (n: string, t: TrackingType, plan: Exercise | undefined) => {
    const s = suggest(n, t, plan, entries)
    setValues(s.values)
    setSource(s.source)
    setStep('log')
  }

  const pickPlan = (e: Exercise) => {
    setExercise(e)
    setName(e.name)
    setType(e.trackingType)
    goLog(e.name, e.trackingType, e)
  }

  const trimmed = name.trim()

  if (step === 'pick') {
    return (
      <AnswerSheet
        open={open}
        onOpenChange={onOpenChange}
        title="What did you do?"
        why="Pick an exercise from your plan, or add something else."
      >
        <ul className="m-0 list-none p-0" aria-label="Exercise">
          {plan.map((e) => (
            <li key={e.id}>
              <PickRow
                label={e.name}
                detail={`${TYPE_META[e.trackingType].label} · ${targetText(e)}`}
                onClick={() => pickPlan(e)}
              />
            </li>
          ))}
          <li>
            <PickRow
              label="Something else"
              detail="Name it and choose how it is counted"
              onClick={() => {
                setExercise(null)
                setStep('custom')
              }}
            />
          </li>
        </ul>
      </AnswerSheet>
    )
  }

  if (step === 'custom') {
    return (
      <AnswerSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Add something else"
        why="Name it and choose how it is counted. You can log it again later in one tap."
        saveLabel="Set amounts"
        canSave={trimmed.length > 0}
        closeOnSave={false}
        onSave={() => goLog(trimmed, type, undefined)}
      >
        <label className="flex flex-col gap-2" htmlFor="custom-name">
          <span className="text-[15px] font-medium text-muted">Exercise name</span>
          <input
            id="custom-name"
            type="text"
            value={name}
            maxLength={MAX_NAME}
            autoComplete="off"
            autoCapitalize="sentences"
            enterKeyHint="next"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && trimmed.length > 0) {
                e.preventDefault()
                goLog(trimmed, type, undefined)
              }
            }}
            className="h-14 w-full rounded-2xl bg-surface-2 px-4 text-xl text-ink placeholder:text-muted"
            placeholder="For example, Burpees"
          />
        </label>
        <p className="m-0 pt-1 text-[15px] text-muted" role="status">
          {trimmed.length === 0 ? 'Enter a name to continue.' : `${trimmed.length} of ${MAX_NAME} characters`}
        </p>
        <div role="radiogroup" aria-label="How it is counted" className="mt-2">
          {TYPE_CHOICES.map((c) => (
            <OptionRow
              key={c.type}
              role="radio"
              checked={type === c.type}
              label={c.label}
              detail={c.detail}
              onClick={() => setType(c.type)}
            />
          ))}
        </div>
      </AnswerSheet>
    )
  }

  const meta = TYPE_META[type]
  return (
    <AnswerSheet
      open={open}
      onOpenChange={onOpenChange}
      title={trimmed}
      why={exercise ? targetText(exercise).replace(/ (kg)/, '\u00a0$1') : 'A new exercise'}
      tape={meta.tape}
      saveLabel="Log set"
      onSave={() => {
        if (saved.current) return
        saved.current = true
        onAdd({ name: trimmed, trackingType: type, values, exerciseId: exercise?.id })
      }}
    >
      <div className="flex flex-col gap-4">
        <span className="flex w-fit items-center gap-2 rounded-full bg-surface-2 py-1.5 pr-3.5 pl-2.5 text-[17px] font-semibold">
          <span className="size-3 rounded-full bg-(--tape)" aria-hidden="true" />
          {meta.label}
        </span>
        {exercise ? (
          <>
            <DemoFigure exerciseId={exercise.id} name={exercise.name} compact />
            <p className="m-0 text-lg leading-snug text-ink" data-testid="manual-cue">
              {exercise.cue}
            </p>
          </>
        ) : (
          <p className="m-0 text-[15px] text-muted" data-testid="manual-no-media">
            No demo or form cue for a new exercise yet.
          </p>
        )}
        <div className="flex flex-col gap-4 rounded-3xl border border-line p-4 max-[360px]:p-3" data-testid="manual-inputs">
          <SetFields type={type} values={values} onChange={(p) => setValues((v) => ({ ...v, ...p }))} />
          <p className="m-0 flex items-center gap-2 text-[15px] text-muted" data-testid="manual-note">
            {source !== 'default' && <History size={18} aria-hidden="true" />}
            {SOURCE_NOTE[source]}
          </p>
        </div>
        <button
          type="button"
          className="press h-14 w-full rounded-2xl bg-surface-2 text-lg font-semibold"
          onClick={() => setStep('pick')}
        >
          Change exercise
        </button>
      </div>
    </AnswerSheet>
  )
}

/** A tappable pick row: tapping moves to the next step, so it is a button with a chevron, not a radio. */
function PickRow({ label, detail, onClick }: { label: string; detail: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press flex min-h-16 w-full items-center gap-3 border-t border-line py-2.5 text-left first:border-t-0"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xl leading-tight font-semibold">{label}</span>
        <span className="text-[15px] text-pretty text-muted">{detail}</span>
      </span>
      <ChevronRight size={24} className="shrink-0 text-muted" aria-hidden="true" />
    </button>
  )
}
