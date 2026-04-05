import { useAuthStore } from './store/auth'
import Onboarding from './screens/Onboarding'
import Lobby from './screens/Lobby'

const App = () => {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Onboarding />

  return <Lobby />
}

export default App
