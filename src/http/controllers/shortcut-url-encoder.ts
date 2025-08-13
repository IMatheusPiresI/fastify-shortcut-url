import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateShortUrlUseCase } from '../../use-cases/create-short-url-use-case'
import { UrlPrismaRepository } from '../../repositories/prisma/url-prisma-repository'
import { CreateUrlEncodedUseCase } from '../../use-cases/create-url-encoded'
import { ShortUrlPrismaRepository } from '../../repositories/prisma/short-url-prisma-repository'
import { encodeUrlSchema } from './schemas/encode-url-schema'

export async function encodeUrl(request: FastifyRequest, reply: FastifyReply) {
  const { url } = encodeUrlSchema.parse(request.body)

  const createShortUrlUseCase = new CreateShortUrlUseCase()
  const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(
    new UrlPrismaRepository(),
    new ShortUrlPrismaRepository()
  )

  try {
    const { shortCode } = createShortUrlUseCase.execute()

    console.log('shortCode', shortCode)

    const { urlEncoded } = await createUrlEncodedUseCase.execute({
      url,
      shortCode,
    })

    reply.status(200).send({ urlEncoded })
  } catch (err) {
    const error = err as Error
    return reply.status(400).send({ message: error.message })
  }
}
