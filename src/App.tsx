import { lazy, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { DataToggle } from './components/DataToggle'
import { library, session } from './data/fixtures'
import type { Entry } from './entries'
import { loadChosen, programmeById, progressFor, saveChosen, type Chosen } from './lib/programme'
import { loadSaved, saveSaved } from './lib/saved'
import { loadLimits, saveLimits } from './lib/limits'
import { loadEntries, saveEntries, ENTRIES_KEY } from './lib/storage'
import { EMPTY_ANSWERS, type Answers } from './onboarding'
import { ProgrammeScreen } from './screens/ProgrammeScreen'
import { RemindersScreen } from './screens/RemindersScreen'
import { SetupScreen } from './screens/SetupScreen'
import { TodayScreen } from './screens/TodayScreen'
import { ScreenSkeleton } from './components/ScreenSkeleton'
import { TabBar, type TabId } from './components/TabBar'

// The longer screens load on demand, with a skeleton in the meantime.
const ExerciseDetailScreen = lazy(() => import('./screens/ExerciseDetailScreen').then((m) => ({ default: m.ExerciseDetailScreen })))
const ExercisesScreen = lazy(() => import('./screens/ExercisesScreen').then((m) => ({ default: m.ExercisesScreen })))
const MyProgrammeScreen = lazy(() => import('./screens/MyProgrammeScreen').then((m) => ({ default: m.MyProgrammeScreen })))
const PlayerScreen = lazy(() => import('./screens/PlayerScreen').then((m) => ({ default: m.PlayerScreen })))
const ProgressScreen = lazy(() => import('./screens/ProgressScreen').then((m) => ({ default: m.ProgressScreen })))

type Stage = 'setup' | 'programme' | 'reminders' | TabId | 'player' | 'exercise' | 'myprogramme'
const STAGES: Stage[] = ['programme', 'reminders', 'today', 'exercises', 'progress', 'player', 'exercise', 'myprogramme']

function initialStage(): Stage {
  const s = new URLSearchParams(window.location.search).get('stage')
  return STAGES.includes(s as Stage) ? (s as Stage) : 'setup'
}

/** An id that works without a secure context (randomUUID is missing on plain http over a LAN). */
function newId(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
    if (typeof crypto.getRandomValues === 'function') {
      return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 8)}`
}

function Screen() {
  const [stage, setStageNow] = useState<Stage>(initialStage)
  // Moving to a screen that loads on demand keeps the current screen until the new one is ready.
  const setStage = (s: Stage) => startTransition(() => setStageNow(s))
  // Exercise detail: which exercise, and which tab it was opened from.
  const [detailId, setDetailId] = useState(() => new URLSearchParams(window.location.search).get('id') ?? '')
  const [detailFrom, setDetailFrom] = useState<TabId>(() =>
    new URLSearchParams(window.location.search).get('from') === 'today' ? 'today' : 'exercises',
  )
  const openExercise = (from: TabId) => (id: string) => {
    setDetailId(id)
    setDetailFrom(from)
    setStage('exercise')
    window.scrollTo(0, 0)
  }
  const [answers, setAnswers] = useState<Answers>(() => ({ ...EMPTY_ANSWERS, limits: loadLimits() }))
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  // A 5-4-3-2-1 countdown runs when a workout is started from a button, not when the screen is opened by address.
  const [getReady, setGetReady] = useState(false)
  const startWorkout = () => {
    setGetReady(true)
    setStage('player')
  }
  const [savedIds, setSavedIds] = useState<string[]>(loadSaved)
  /** Returns false when the browser refused to keep the change. */
  const toggleSaved = (id: string): boolean => {
    const next = savedIds.includes(id) ? savedIds.filter((x) => x !== id) : [...savedIds, id]
    setSavedIds(next)
    return saveSaved(next)
  }
  const [saveFailed, setSaveFailed] = useState(false)
  const [chosen, setChosen] = useState<Chosen | null>(loadChosen)
  const chosenProgramme = programmeById(chosen?.id)
  const now = Date.now()
  const programmeRow = (() => {
    if (!chosen || !chosenProgramme) return null
    const pr = progressFor(chosenProgramme, chosen, entries, now)
    return { name: chosenProgramme.name, status: pr.finished ? 'Programme finished' : `Week ${pr.week} of ${pr.weeks}` }
  })()
  // The detail screen can show anything in the plan or the library.
  const allExercises = [...session.exercises, ...library.filter((l) => !session.exercises.some((p) => p.id === l.id))]
  const addEntry = (e: Omit<Entry, 'id'>) =>
    setEntries((list) => [{ ...e, at: e.at ?? Date.now(), id: newId() }, ...list])

  const updateEntry = (id: string, values: Entry['values']) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, values } : e)))
  const deleteEntry = (id: string) => setEntries((list) => list.filter((e) => e.id !== id))

  // Save every change, but not the list we just read from storage on load.
  const initial = useRef(entries)
  useEffect(() => {
    if (entries === initial.current) return
    setSaveFailed(!saveEntries(entries))
  }, [entries])

  // Remember the limits so the Exercises list can keep honouring them after a reload.
  useEffect(() => {
    saveLimits(answers.limits)
  }, [answers.limits])

  // Another tab changed the saved entries: show them here too.
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      // A cleared or removed key (newValue null) must not write an empty list back.
      if (ev.key === ENTRIES_KEY && ev.newValue !== null) {
        setEntries(loadEntries())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (stage === 'setup')
    return <SetupScreen answers={answers} onChange={setAnswers} onCreate={() => setStage('programme')} />
  if (stage === 'programme')
    return (
      <ProgrammeScreen
        answers={answers}
        onBack={() => setStage('setup')}
        onStart={(id) => {
          const c = { id, startedAt: Date.now() }
          setChosen(c)
          saveChosen(c)
          setStage('reminders')
        }}
      />
    )
  if (stage === 'reminders') return <RemindersScreen onDone={() => setStage('progress')} />
  if (stage === 'player')
    return (
      <PlayerScreen
        session={session}
        getReady={getReady}
        onExit={() => setStage('progress')}
        onFinish={() => setStage('today')}
        onLog={(list) => list.forEach(addEntry)}
      />
    )
  return (
    <>
      {stage === 'today' && <TodayScreen
          session={session}
          onStart={startWorkout}
          onChoose={() => setStage('setup')}
          onOpen={openExercise('today')}
          programme={programmeRow}
          onProgramme={() => {
            setStage(programmeRow ? 'myprogramme' : 'setup')
            window.scrollTo(0, 0)
          }}
        />}
      {stage === 'myprogramme' && (
        <MyProgrammeScreen
          programme={chosenProgramme}
          chosen={chosen}
          entries={entries}
          now={now}
          onBack={() => setStage('today')}
          onStart={startWorkout}
          onChange={() => setStage('setup')}
          onRestart={() => {
            if (!chosen) return
            const c = { id: chosen.id, startedAt: Date.now() }
            setChosen(c)
            saveChosen(c)
          }}
          onAdvance={() => {
            if (!chosen || !chosenProgramme) return
            const pr = progressFor(chosenProgramme, chosen, entries, now)
            const cur = pr.stages.find((s) => s.current)
            if (!cur || !pr.next) return
            const c = { ...chosen, skipped: (chosen.skipped ?? 0) + (cur.size - cur.done) }
            setChosen(c)
            saveChosen(c)
          }}
        />
      )}
      {stage === 'exercises' && (
        <ExercisesScreen exercises={library} limits={answers.limits} savedIds={savedIds} onStart={() => setStage('setup')} onOpen={openExercise('exercises')} />
      )}
      {stage === 'exercise' && (
        <ExerciseDetailScreen
          exercise={allExercises.find((e) => e.id === detailId)}
          plan={session.exercises}
          entries={entries}
          onAdd={addEntry}
          saved={savedIds.includes(detailId)}
          onToggleSaved={() => toggleSaved(detailId)}
          onBack={() => setStage(detailFrom)}
        />
      )}
      {stage === 'progress' && (
        <ProgressScreen
          onStart={startWorkout}
          plan={session.exercises}
          entries={entries}
          saveFailed={saveFailed}
          onAdd={addEntry}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
          onClear={() => setEntries([])}
        />
      )}
      <TabBar current={stage === 'exercise' ? detailFrom : stage === 'myprogramme' ? 'today' : stage} onChange={setStage} />
    </>
  )
}

export default function App() {
  return (
    <>
      <Suspense fallback={<ScreenSkeleton />}>
        <Screen />
      </Suspense>
      <DataToggle />
    </>
  )
}
