import { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import { prisma } from '../db/client'
import { redis } from '../db/redis'
import { roomService } from '../services/game'
import { authenticate } from '../lib/authenticate'
import { GameType } from '../services/game'

const MAX_PLAYERS: Record<GameType, number> = {
  SNITCH: 8,
  SHOVE: 6,
  WHO_SAID_THAT: 8,
}

export const roomRoutes = async (app: FastifyInstance) => {
  app.post('/rooms', { preHandler: authenticate }, async (request, reply) => {
    const user = (request as any).user
    const { gameType } = request.body as { gameType?: string }

    if (!gameType || !['SNITCH', 'SHOVE', 'WHO_SAID_THAT'].includes(gameType)) {
      return reply.status(400).send({ error: 'Invalid gameType' })
    }

    const type = gameType as GameType
    const roomId = nanoid(10)
    const maxPlayers = MAX_PLAYERS[type]

    await prisma.room.create({
      data: {
        id: roomId,
        gameType: type,
        hostId: user.userId,
        maxPlayers,
      },
    })

    const service = roomService(redis)
    const room = await service.create(roomId, user.userId, type, maxPlayers)

    return { room }
  })

  app.get('/rooms/:roomId', { preHandler: authenticate }, async (request, reply) => {
    const { roomId } = request.params as { roomId: string }
    const service = roomService(redis)
    const room = await service.get(roomId)

    if (!room) {
      return reply.status(404).send({ error: 'Room not found' })
    }

    return { room }
  })
}
