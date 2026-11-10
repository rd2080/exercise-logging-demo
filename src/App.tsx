import { useState } from 'react'
import session from '../fixtures/session.json'
import { EMPTY_ANSWERS, type Answers } from './onboarding'
import { PlayerScreen } from './screens/PlayerScreen'
import { ProgrammeScreen } from './screens/ProgrammeScreen'
import { RemindersScreen } from './screens/RemindersScreen'
import { SetupScreen } from './screens/SetupScreen'
import type { Session } from './types'

type Stage = 'setup' | 'programme' | 'reminders' | 'player'

function initialStage(): Stage {
  const s = new URLSearchParams(window.location.search).get('stage')
  return s === 'player' || s === 'programme' || s === 'reminders' ? s : 'setup'
}

export default function App() {
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
  if (stage === 'reminders') return <RemindersScreen onDone={() => setStage('player')} />
  return <PlayerScreen session={session as Session} />
}
