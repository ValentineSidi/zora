import { useAuthStore } from '../store/auth'

const GAME_CARDS = [
  {
    id: 'SNITCH',
    name: 'Snitch',
    description: 'One player is secretly the snitch. Find them before they win.',
    players: '4 to 8',
    time: '5 min',
  },
  {
    id: 'SHOVE',
    name: 'Shove',
    description: 'Last one standing on the platform wins. Pure chaos.',
    players: '2 to 6',
    time: '90 sec',
  },
  {
    id: 'WHO_SAID_THAT',
    name: 'Who Said That',
    description: 'Guess which friend said what. No skill needed, just receipts.',
    players: '3 to 8',
    time: '3 min',
  },
]

const Lobby = () => {
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)

  return (
    <div style={{ minHeight: '100vh', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        paddingTop: '16px',
      }}>
        <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>zora</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{user?.displayName}</span>
          <button
            onClick={clear}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--color-text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            leave
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          what are we playing?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>pick a game, share the link, watch chaos unfold</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {GAME_CARDS.map((game) => (
          <div
            key={game.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-aurora)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{game.name}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              {game.description}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{game.players} players</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{game.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lobby
