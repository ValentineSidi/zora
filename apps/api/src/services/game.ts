import { Redis } from 'ioredis'

export type GameType = 'SNITCH' | 'SHOVE' | 'WHO_SAID_THAT'
export type RoomStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED'

export interface Player {
  userId: string
  displayName: string
  avatarIndex: number
  isReady: boolean
}

export interface Room {
  id: string
  gameType: GameType
  status: RoomStatus
  hostId: string
  maxPlayers: number
  players: Player[]
  createdAt: number
}

const ROOM_TTL = 60 * 60 * 2

export const roomService = (redis: Redis) => ({
  async create(roomId: string, hostId: string, gameType: GameType, maxPlayers: number): Promise<Room> {
    const room: Room = {
      id: roomId,
      gameType,
      status: 'WAITING',
      hostId,
      maxPlayers,
      players: [],
      createdAt: Date.now(),
    }
    await redis.set(`room:${roomId}`, JSON.stringify(room), 'EX', ROOM_TTL)
    return room
  },

  async get(roomId: string): Promise<Room | null> {
    const data = await redis.get(`room:${roomId}`)
    if (!data) return null
    return JSON.parse(data) as Room
  },

  async save(room: Room): Promise<void> {
    await redis.set(`room:${room.id}`, JSON.stringify(room), 'EX', ROOM_TTL)
  },

  async addPlayer(roomId: string, player: Player): Promise<Room | null> {
    const room = await this.get(roomId)
    if (!room) return null
    if (room.players.length >= room.maxPlayers) return null
    if (room.players.find((p) => p.userId === player.userId)) return room
    room.players.push(player)
    await this.save(room)
    return room
  },

  async removePlayer(roomId: string, userId: string): Promise<Room | null> {
    const room = await this.get(roomId)
    if (!room) return null
    room.players = room.players.filter((p) => p.userId !== userId)
    if (room.players.length === 0) {
      await redis.del(`room:${roomId}`)
      return null
    }
    if (room.hostId === userId && room.players.length > 0) {
      room.hostId = room.players[0].userId
    }
    await this.save(room)
    return room
  },

  async delete(roomId: string): Promise<void> {
    await redis.del(`room:${roomId}`)
  },
})
