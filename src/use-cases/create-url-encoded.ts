import { Url } from '@prisma/client'
import { UrlRepository } from '../repositories/url-repository'
import { ShortUrlRepository } from '../repositories/short-url-repository'
import { _env } from '../env'
import { ShortCodeAlreadyExistsError } from './errors/short-code-already-exists.error'

interface CreateUrlEncodedUseCaseRequest {
  url: string
  shortCode: string
}

interface CreateUrlEncodedUseCaseResponse {
  urlEncoded: string
}

export class CreateUrlEncodedUseCase {
  private readonly urlRepository: UrlRepository
  private readonly shortUrlRepository: ShortUrlRepository

  constructor(urlRepository: UrlRepository, shortUrlRepository: ShortUrlRepository) {
    this.urlRepository = urlRepository
    this.shortUrlRepository = shortUrlRepository
  }

  async execute({
    url,
    shortCode,
  }: CreateUrlEncodedUseCaseRequest): Promise<CreateUrlEncodedUseCaseResponse> {
    const urlExists = await this.urlRepository.getUrlByOriginalUrl(url)

    if (urlExists) {
      const shortUrlExists = await this.shortUrlRepository.findByShortCode(shortCode)

      if (shortUrlExists) {
        throw new ShortCodeAlreadyExistsError()
      }

      const shortUrlCreated = await this.shortUrlRepository.create({
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        shortCode,
        url: {
          connect: {
            id: urlExists.id,
          },
        },
      })

      return {
        urlEncoded: `${_env.DOMAIN}/${shortUrlCreated.shortCode}`,
      }
    }

    const urlCreated = await this.urlRepository.createUrl({
      url,
    })

    const shortUrlCreated = await this.shortUrlRepository.create({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //7 days
      shortCode,
      url: {
        connect: {
          id: urlCreated.id,
        },
      },
    })

    return {
      urlEncoded: `${_env.DOMAIN}/${shortUrlCreated.shortCode}`,
    }
  }
}
