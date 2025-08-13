import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'
import { UrlPrismaRepository } from '../../repositories/prisma/url-prisma-repository'
import { ShortUrlPrismaRepository } from '../../repositories/prisma/short-url-prisma-repository'
import { FindUrlOriginalByShortUrlUseCase } from '../../use-cases/find-url-original-by-short-url-use-case'
import { redirectShortUrlSchema } from './schemas/redirect-short-url-schema'
import { AddClickCountShortUrlOpenedUseCase } from '../../use-cases/add-click-count-short-url-opened-use-case'

export async function redirectShortUrl(request: FastifyRequest, reply: FastifyReply) {
  const { shortCode } = redirectShortUrlSchema.parse(request.params)

  try {
    const urlRepository = new UrlPrismaRepository()
    const shortUrlRepository = new ShortUrlPrismaRepository()
    const findUrlOriginalByShortUrlUseCase = new FindUrlOriginalByShortUrlUseCase(
      shortUrlRepository,
      urlRepository
    )
    const addClickCountShortUrlOpenedUseCase = new AddClickCountShortUrlOpenedUseCase(
      shortUrlRepository
    )

    const urlOriginal = await findUrlOriginalByShortUrlUseCase.execute(shortCode)
    await addClickCountShortUrlOpenedUseCase.execute(shortCode)

    return reply.status(302).redirect(urlOriginal.url)
  } catch (err) {
    const error = err as Error
    return reply.status(400).send({ message: error.message })
  }
}
