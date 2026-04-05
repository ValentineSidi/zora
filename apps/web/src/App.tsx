import { useAuthStore } from './store/auth'
import Onboarding from './screens/Onboarding'

const App = () => {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Onboarding />

  return (
    <div style={{ padding: '24px' }}>
      <h2>welcome, {user.displayName}</h2>
    </div>
  )
}

export default App
