import { ArrowLeft } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EmptySlots } from '../components/EmptySlots'
import { EmptyState } from '../components/EmptyState'
import { WeekDots } from '../components/WeekDots'
import { progressFor, type Chosen } from '../lib/programme'
import type { Entry } from '../entries'
import type { Programme } from '../onboarding'

interface MyProgrammeScreenProps {
  programme: Programme | undefined
  chosen: Chosen | null
  entries: Entry[]
  now: number
  onBack: () => void
  onStart: () => void
  onChange: () => void
  onAdvance: () => void
  onRestart: () => void
}

function Back({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      className="press grid size-12 place-items-center rounded-full bg-surface-2"
      aria-label="Back to today"
      onClick={onBack}
      data-testid="programme-back"
    >
      <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

const shell = 'mx-auto flex min-h-dvh w-full max-w-[480px] flex-col'
const main = 'flex flex-1 flex-col gap-6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-28'

export function MyProgrammeScreen({ programme, chosen, entries, now, onBack, onStart, onChange, onAdvance, onRestart }: MyProgrammeScreenProps) {
  const [confirming, setConfirming] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const tape = { '--tape': 'var(--color-tape-reps)' } as CSSProperties
  if (!programme || !chosen) {
    return (
      <div className={shell} style={tape} data-testid="my-programme-empty">
        <main className={main}>
          <Back onBack={onBack} />
          <EmptyState
            illustration={<EmptySlots />}
            title="No programme yet"
            body="Choose a programme to get a plan with weeks, stages and training days."
            actionLabel="Choose a programme"
            onAction={onChange}
          />
        </main>
      </div>
    )
  }

  const pr = progressFor(programme, chosen, entries, now)
  const stage = pr.stages.find((s) => s.current)
  const status = pr.finished
    ? 'Programme finished'
    : `Week ${pr.week} of ${pr.weeks}${stage ? ` · Stage ${pr.stages.indexOf(stage) + 1}: ${stage.name}` : ''}`

  return (
    <div className={shell} style={tape} data-testid="my-programme">
      <main className={main}>
        <Back onBack={onBack} />
        <header className="flex flex-col gap-2">
          <h1 className="font-display m-0 text-[36px] leading-[1.05] font-bold text-balance [overflow-wrap:anywhere]">
            {programme.name}
          </h1>
          <p className="m-0 text-lg text-pretty text-muted" data-testid="programme-status">
            {status}
          </p>
        </header>

        <button
          type="button"
          className="press h-16 w-full rounded-full bg-(--tape) text-xl font-bold text-on-tape"
          onClick={onStart}
          data-testid="programme-start"
        >
          Start workout
        </button>

        <section className="flex flex-col gap-3" aria-labelledby="week-heading">
          <h2 id="week-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            This week
          </h2>
          <WeekDots planned={pr.planned} done={pr.done} today={pr.today} />
          <p className="num m-0 text-[17px] text-muted" data-testid="week-summary">
            {pr.sessionsThisWeek} of {pr.plannedThisWeek} sessions this week
          </p>
          <p className="num m-0 text-[17px]" data-testid="streak">
            <span className="font-semibold">
              {pr.streak > 0 ? `${pr.streak} ${pr.streak === 1 ? 'week' : 'weeks'} in a row` : 'No streak yet'}
            </span>
            <span className="text-muted">
              {pr.streak > 0
                ? ' with a session'
                : '. Log a workout this week to start one.'}
            </span>
          </p>
        </section>

        <dl
          className="m-0 grid grid-cols-[auto_auto_minmax(0,1fr)] border-y border-line max-[360px]:grid-cols-2"
          data-testid="stats"
        >
          {[
            [String(programme.weeks), programme.weeks === 1 ? 'week' : 'weeks'],
            [String(programme.perWeek), 'sessions a week'],
            [programme.level, 'level'],
          ].map(([value, label], i) => (
            <div
              key={label}
              className={`flex min-w-0 flex-col gap-0.5 px-3 py-3 ${i > 0 ? 'border-l border-line' : 'pl-0'} ${
                i === 2 ? 'max-[360px]:col-span-2 max-[360px]:border-t max-[360px]:border-l-0 max-[360px]:pl-0' : ''
              }`}
            >
              <dd
                className={`font-display m-0 leading-none font-bold ${
                  /^\d+$/.test(value) ? 'text-[28px]' : 'text-xl leading-tight'
                }`}
              >
                {value}
              </dd>
              <dt className="text-[15px] text-muted">{label}</dt>
            </div>
          ))}
        </dl>

        <section className="flex flex-col gap-1" aria-labelledby="stages-heading">
          <h2 id="stages-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            Stages
          </h2>
          <p className="num m-0 pb-1 text-[17px] text-muted" data-testid="overall">
            {pr.sessionsDone} of {pr.sessionsTotal} sessions done
          </p>
          <ol className="m-0 flex list-none flex-col p-0" data-testid="stage-list">
            {pr.stages.map((s, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 border-t border-line py-4 first:border-t-0"
                aria-current={s.current ? 'step' : undefined}
                data-current={s.current ? 'true' : undefined}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display m-0 min-w-0 text-xl leading-tight font-semibold [overflow-wrap:anywhere]">
                    Stage {i + 1}: {s.name}
                  </h3>
                  <span className="num shrink-0 text-[17px] whitespace-nowrap text-muted">
                    {s.done} of {s.size}
                  </span>
                </div>
                <p className="m-0 text-[17px] text-pretty text-muted">
                  {s.weeks === 1 ? `Week ${s.firstWeek}` : `Weeks ${s.firstWeek} to ${s.lastWeek}`}
                  {s.focus ? ` · ${s.focus}` : ''}
                </p>
                <div
                  className="grid gap-1"
                  style={
                    {
                      '--cut': '4px',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(18px, 1fr))',
                    } as CSSProperties
                  }
                  role="img"
                  aria-label={`${s.done} of ${s.size} sessions done`}
                >
                  {Array.from({ length: s.size }, (_, k) => (
                    <span key={k} className={`tape-cut h-3 ${k < s.done ? 'tape-fill' : 'bg-surface-2'}`} />
                  ))}
                </div>
                {s.current && (
                  <span className="w-fit rounded-full bg-surface-2 px-3 py-1 text-[15px] font-semibold">
                    Current stage
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {pr.next && stage && (
          <section className="flex flex-col gap-3" aria-labelledby="advance-heading">
            <h2 id="advance-heading" className="font-display m-0 text-2xl leading-tight font-bold">
              Ready to move on?
            </h2>
            <p className="m-0 text-lg text-pretty text-muted">
              Next is Stage {pr.stages.indexOf(pr.next) + 1}: {pr.next.name}. The {stage.size - stage.done} sessions left
              in this stage will count as done.
            </p>
            <button
              type="button"
              className="press h-14 w-full rounded-full bg-surface-2 text-xl font-semibold"
              onClick={() => setConfirming(true)}
              data-testid="advance"
            >
              Move to stage {pr.stages.indexOf(pr.next) + 1}
            </button>
            <ConfirmSheet
              open={confirming}
              onOpenChange={setConfirming}
              title={`Switch to stage ${pr.stages.indexOf(pr.next) + 1}?`}
              why={`${pr.next.name} starts now. The ${stage.size - stage.done} sessions left in this stage count as done, and this cannot be undone.`}
              confirmLabel={`Switch to stage ${pr.stages.indexOf(pr.next) + 1}`}
              onConfirm={onAdvance}
              tape="var(--color-tape-reps)"
              testId="advance-confirm"
            />
          </section>
        )}

        <section className="flex flex-col gap-3" aria-labelledby="need-heading">
          <h2 id="need-heading" className="font-display m-0 text-2xl leading-tight font-bold">
            What you need
          </h2>
          <p className="m-0 text-lg text-pretty">{programme.needs}</p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Focus">
            {programme.tags.map((t) => (
              <li key={t} className="rounded-full bg-surface-2 px-3 py-1.5 text-[17px] font-semibold">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          className="press h-14 w-full rounded-full text-xl font-semibold"
          onClick={onChange}
          data-testid="programme-change"
        >
          Choose a different programme
        </button>
        <button
          type="button"
          className="press h-14 w-full rounded-full text-xl font-semibold"
          onClick={() => setRestarting(true)}
          data-testid="programme-restart"
        >
          Restart programme
        </button>
        <ConfirmSheet
          open={restarting}
          onOpenChange={setRestarting}
          title="Restart this programme?"
          why="Week 1 starts again today, with no sessions counted and the streak back at zero. Your logged sets stay."
          confirmLabel="Restart programme"
          onConfirm={onRestart}
          tape="var(--color-tape-reps)"
          testId="restart-confirm"
        />
      </main>
    </div>
  )
}
