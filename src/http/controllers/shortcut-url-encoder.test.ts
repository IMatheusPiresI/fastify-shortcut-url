import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { encodeUrl } from './shortcut-url-encoder'
import Fastify, { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import { _env } from '../../env'
import { UrlPrismaRepository } from '../../repositories/prisma/url-prisma-repository'
import { ShortUrlPrismaRepository } from '../../repositories/prisma/short-url-prisma-repository'
import { CreateShortUrlUseCase } from '../../use-cases/create-short-url-use-case'
import { ShortCodeAlreadyExistsError } from '../../use-cases/errors/short-code-already-exists.error'

describe('encodeUrl', () => {
  let app: FastifyInstance
  beforeAll(async () => {
    app = Fastify()
    app.post('/encode-url', encodeUrl)
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

  it('should be able to encode a url', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/encode-url`,
      body: {
        url: 'https://www.google.com',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).include(_env.DOMAIN)
  })

  it('should not be able to encode a url that already exists', async () => {
    const urlPrismaRepository = new UrlPrismaRepository()
    const shortUrlPrismaRepository = new ShortUrlPrismaRepository()

    await urlPrismaRepository.createUrl({
      id: '111',
      url: 'https://www.googleeee.com',
      createdAt: new Date(),
    })

    await shortUrlPrismaRepository.create({
      id: '111',
      shortCode: '123456789',
      expiresAt: new Date(),
      url: { connect: { id: '111' } },
    })

    // MOCK no prototype
    vi.spyOn(CreateShortUrlUseCase.prototype, 'execute').mockReturnValue({
      shortCode: '123456789',
    })

    const response = await app.inject({
      method: 'POST',
      url: `/encode-url`,
      body: { url: 'https://www.googleeee.com' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(
      JSON.stringify({ message: new ShortCodeAlreadyExistsError().message })
    )
  })

  it('should not be able to encode a url that is not a valid url', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/encode-url`,
      body: { url: 'invalid-url' },
    })

    expect(response.statusCode).toBe(500)
  })
})
