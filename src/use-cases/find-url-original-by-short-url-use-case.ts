import { ShortUrlRepository } from '../repositories/short-url-repository'
import { UrlRepository } from '../repositories/url-repository'
import { ShortCodeNotFoundError } from './errors/short-code-not-found.error'
import { ShortUrlExpiredError } from './errors/short-url-expired.error'
import { UrlNotFoundError } from './errors/url-not-found.error'

export class FindUrlOriginalByShortUrlUseCase {
  private readonly shortUrlRepository: ShortUrlRepository
  private readonly urlRepository: UrlRepository

  constructor(shortUrlRepository: ShortUrlRepository, urlRepository: UrlRepository) {
    this.shortUrlRepository = shortUrlRepository
    this.urlRepository = urlRepository
  }

  async execute(shortCode: string) {
    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode)

    if (!shortUrl?.id) {
      throw new ShortCodeNotFoundError()
    }

    if (shortUrl.expiresAt.getTime() < new Date().getTime()) {
      throw new ShortUrlExpiredError()
    }

    const url = await this.urlRepository.getUrlById(shortUrl.urlId)

    if (!url) {
      throw new UrlNotFoundError()
    }

    return url
  }
}
