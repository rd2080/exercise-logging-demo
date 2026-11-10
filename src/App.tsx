import { useState } from 'react'
import { DataToggle } from './components/DataToggle'
import { session } from './data/fixtures'
import { EMPTY_ANSWERS, type Answers } from './onboarding'
import { PlayerScreen } from './screens/PlayerScreen'
import { ProgrammeScreen } from './screens/ProgrammeScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { RemindersScreen } from './screens/RemindersScreen'
import { SetupScreen } from './screens/SetupScreen'

type Stage = 'setup' | 'programme' | 'reminders' | 'progress' | 'player'

function initialStage(): Stage {
  const s = new URLSearchParams(window.location.search).get('stage')
  return s === 'player' || s === 'programme' || s === 'reminders' || s === 'progress' ? s : 'setup'
}

function Screen() {
  const [stage, setStage] = useState<Stage>(initialStage)
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)

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
  if (stage === 'progress') return <ProgressScreen onStart={() => setStage('player')} />
  return <PlayerScreen session={session} onExit={() => setStage('progress')} />
}

export default function App() {
  return (
    <>
      <Screen />
      <DataToggle />
    </>
  )
}
