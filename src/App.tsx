import { useState } from 'react'
import { DataToggle } from './components/DataToggle'
import { session } from './data/fixtures'
import { EMPTY_ANSWERS, type Answers } from './onboarding'
import { ExercisesScreen } from './screens/ExercisesScreen'
import { PlayerScreen } from './screens/PlayerScreen'
import { ProgrammeScreen } from './screens/ProgrammeScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { RemindersScreen } from './screens/RemindersScreen'
import { SetupScreen } from './screens/SetupScreen'
import { TodayScreen } from './screens/TodayScreen'
import { TabBar, type TabId } from './components/TabBar'

type Stage = 'setup' | 'programme' | 'reminders' | TabId | 'player'
const STAGES: Stage[] = ['programme', 'reminders', 'today', 'exercises', 'progress', 'player']

function initialStage(): Stage {
  const s = new URLSearchParams(window.location.search).get('stage')
  return STAGES.includes(s as Stage) ? (s as Stage) : 'setup'
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
  if (stage === 'player')
    return (
      <PlayerScreen
        session={session}
        onExit={() => setStage('progress')}
        onFinish={() => setStage('today')}
      />
    )
  return (
    <>
      {stage === 'today' && <TodayScreen
          session={session}
          onStart={() => setStage('player')}
          onChoose={() => setStage('setup')}
        />}
      {stage === 'exercises' && <ExercisesScreen session={session} onStart={() => setStage('setup')} />}
      {stage === 'progress' && <ProgressScreen onStart={() => setStage('player')} />}
      <TabBar current={stage} onChange={setStage} />
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
