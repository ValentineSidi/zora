import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from './jwt'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing authorization header' })
  }

  const token = authHeader.slice(7)

  try {
    const payload = verifyAccessToken(token)
    ;(request as any).user = payload
  } catch {
    return reply.status(401).send({ error: 'Invalid or expired token' })
  }
}