const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface GuestAuthResponse {
  accessToken: string
  user: { id: string; displayName: string }
}

export const api = {
  async guestLogin(displayName: string): Promise<GuestAuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ displayName }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }

    return res.json()
  },

  async refreshToken(): Promise<GuestAuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!res.ok) throw new Error('Session expired')

    return res.json()
  },
}
