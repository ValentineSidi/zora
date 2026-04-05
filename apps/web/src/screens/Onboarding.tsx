import { useState } from 'react'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'

const AVATARS = ['🟣', '🔴', '🟡', '🟢', '🔵', '🟠']

const Onboarding = () => {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleEnter = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.guestLogin(trimmed)
      setAuth(res.user, res.accessToken)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '32px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-1px' }}>zora</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>your world. live.</p>
      </div>

      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {AVATARS.map((a, i) => (
            <button
              key={i}
              onClick={() => setAvatar(i)}
              style={{
                fontSize: '28px',
                background: 'none',
                border: `2px solid ${avatar === i ? 'var(--color-aurora)' : 'transparent'}`,
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              {a}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="your name"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: 'var(--color-text-primary)',
            fontSize: '16px',
            outline: 'none',
            width: '100%',
          }}
        />

        {error && (
          <p style={{ color: 'var(--color-dawn)', fontSize: '14px', textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleEnter}
          disabled={loading}
          style={{
            background: 'var(--color-aurora)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'entering...' : 'enter zora'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
