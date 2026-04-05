import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import websocket from '@fastify/websocket'
import { authRoutes } from './routes/auth'
import { roomRoutes } from './routes/rooms'

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
    },
    trustProxy: false
  })

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })

  await app.register(cookie, {
    secret: process.env.JWT_REFRESH_SECRET as string
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })

  await app.register(websocket)

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  await app.register(authRoutes, { prefix: '/api' })
  await app.register(roomRoutes, { prefix: '/api' })

  return app
}
