import { FastifyInstance } from 'fastify'
import { encodeUrl } from './controllers/shortcut-url-encoder'
import { redirectShortUrl } from './controllers/redirect-short-url'

export async function appRoutes(app: FastifyInstance) {
  app.post('/encode-url', encodeUrl)
  app.get('/:shortCode', redirectShortUrl)
}
