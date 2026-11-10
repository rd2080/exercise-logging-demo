import { useEffect, useRef, useState } from 'react'
import { DataToggle } from './components/DataToggle'
import { library, session } from './data/fixtures'
import type { Entry } from './entries'
import { loadEntries, saveEntries, ENTRIES_KEY } from './lib/storage'
import { EMPTY_ANSWERS, type Answers } from './onboarding'
import { ExerciseDetailScreen } from './screens/ExerciseDetailScreen'
import { ExercisesScreen } from './screens/ExercisesScreen'
import { PlayerScreen } from './screens/PlayerScreen'
import { ProgrammeScreen } from './screens/ProgrammeScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { RemindersScreen } from './screens/RemindersScreen'
import { SetupScreen } from './screens/SetupScreen'
import { TodayScreen } from './screens/TodayScreen'
import { TabBar, type TabId } from './components/TabBar'

type Stage = 'setup' | 'programme' | 'reminders' | TabId | 'player' | 'exercise'
const STAGES: Stage[] = ['programme', 'reminders', 'today', 'exercises', 'progress', 'player', 'exercise']

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
  const [stage, setStage] = useState<Stage>(initialStage)
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
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  const [saveFailed, setSaveFailed] = useState(false)
  // The detail screen can show anything in the plan or the library.
  const allExercises = [...session.exercises, ...library.filter((l) => !session.exercises.some((p) => p.id === l.id))]
  const addEntry = (e: Omit<Entry, 'id'>) =>
    setEntries((list) => [{ ...e, id: newId() }, ...list])

  const updateEntry = (id: string, values: Entry['values']) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, values } : e)))
  const deleteEntry = (id: string) => setEntries((list) => list.filter((e) => e.id !== id))

  // Save every change, but not the list we just read from storage on load.
  const initial = useRef(entries)
  useEffect(() => {
    if (entries === initial.current) return
    setSaveFailed(!saveEntries(entries))
  }, [entries])

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
        onStart={() => setStage('reminders')}
      />
    )
  if (stage === 'reminders') return <RemindersScreen onDone={() => setStage('progress')} />
  if (stage === 'player')
    return (
      <PlayerScreen
        session={session}
        onExit={() => setStage('progress')}
        onFinish={() => setStage('today')}
        onLog={(list) => list.forEach(addEntry)}
      />
    )
  return (
    <>
      {stage === 'today' && <TodayScreen
          session={session}
          onStart={() => setStage('player')}
          onChoose={() => setStage('setup')}
          onOpen={openExercise('today')}
        />}
      {stage === 'exercises' && (
        <ExercisesScreen exercises={library} onStart={() => setStage('setup')} onOpen={openExercise('exercises')} />
      )}
      {stage === 'exercise' && (
        <ExerciseDetailScreen
          exercise={allExercises.find((e) => e.id === detailId)}
          plan={session.exercises}
          entries={entries}
          onAdd={addEntry}
          onBack={() => setStage(detailFrom)}
        />
      )}
      {stage === 'progress' && (
        <ProgressScreen
          onStart={() => setStage('player')}
          plan={session.exercises}
          entries={entries}
          saveFailed={saveFailed}
          onAdd={addEntry}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
        />
      )}
      <TabBar current={stage === 'exercise' ? detailFrom : stage} onChange={setStage} />
    </>
  )
}

export default function App() {
  return (
    <>
      <Screen />
      <DataToggle />
    </>
  )
}
