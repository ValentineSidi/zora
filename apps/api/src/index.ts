import 'dotenv/config'
import { buildApp } from './app'

const start = async () => {
  const app = await buildApp()

  const port = Number(process.env.PORT) || 3001
  const host = '0.0.0.0'

  try {
    await app.listen({ port, host })
    console.log(`Zora API running on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()