import { FastifyInstance } from 'fastify'
import { prisma } from '../db/client'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt'

export const authRoutes = async (app: FastifyInstance) => {
  app.post('/auth/guest', async (request, reply) => {
    const { displayName } = request.body as { displayName?: string }

    if (!displayName || typeof displayName !== 'string') {
      return reply.status(400).send({ error: 'displayName is required' })
    }

    const trimmed = displayName.trim()

    if (trimmed.length < 2 || trimmed.length > 24) {
      return reply.status(400).send({ error: 'displayName must be 2 to 24 characters' })
    }

    const user = await prisma.user.create({
      data: { displayName: trimmed },
    })

    const accessToken = signAccessToken({ userId: user.id, displayName: user.displayName })
    const refreshToken = signRefreshToken(user.id)

    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return { accessToken, user: { id: user.id, displayName: user.displayName } }
  })

  app.post('/auth/refresh', async (request, reply) => {
    const token = request.cookies?.refresh_token

    if (!token) {
      return reply.status(401).send({ error: 'No refresh token' })
    }

    try {
      const payload = verifyRefreshToken(token)

      const user = await prisma.user.findUnique({ where: { id: payload.userId } })

      if (!user) {
        return reply.status(401).send({ error: 'User not found' })
      }

      const accessToken = signAccessToken({ userId: user.id, displayName: user.displayName })

      return { accessToken, user: { id: user.id, displayName: user.displayName } }
    } catch {
      return reply.status(401).send({ error: 'Invalid refresh token' })
    }
  })
}
