import session from '../fixtures/session.json'
import { PlayerScreen } from './screens/PlayerScreen'
import type { Session } from './types'

export default function App() {
  return <PlayerScreen session={session as Session} />
}
