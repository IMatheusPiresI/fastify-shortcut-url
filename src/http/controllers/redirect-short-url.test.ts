import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { redirectShortUrl } from './redirect-short-url'
import { prisma } from '../../lib/prisma'
import { ShortUrlExpiredError } from '../../use-cases/errors/short-url-expired.error'

describe('redirectShortUrl', () => {
  let app: FastifyInstance
  beforeAll(async () => {
    app = Fastify()
    app.get('/:shortCode', redirectShortUrl)
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.shortUrl.deleteMany()
    await prisma.url.deleteMany()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  it('should be able to redirect to the original url', async () => {
    const ORIGINAL_URL = 'https://example.com'
    const url = await prisma.url.create({ data: { url: ORIGINAL_URL } })

    const shortUrl = await prisma.shortUrl.create({
      data: {
        shortCode: 'abc123',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        urlId: url.id,
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: `/${shortUrl.shortCode}`,
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers['location']).toBe(ORIGINAL_URL)
  })

  it('should return 400 if the short code is invalid', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/invalid-short-code',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 if the short code is expired', async () => {
    const ORIGINAL_URL = 'https://example2.com'
    const url = await prisma.url.create({ data: { url: ORIGINAL_URL } })

    const shortUrl = await prisma.shortUrl.create({
      data: {
        shortCode: 'abc123',
        expiresAt: new Date(Date.now() - 1000),
        urlId: url.id,
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: `/${shortUrl.shortCode}`,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(JSON.stringify({ message: new ShortUrlExpiredError().message }))
  })
})
