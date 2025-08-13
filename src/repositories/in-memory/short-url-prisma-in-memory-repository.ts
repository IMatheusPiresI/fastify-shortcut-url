import { Prisma, ShortUrl } from '@prisma/client'
import { ShortUrlRepository } from '../short-url-repository'
import { ShortCodeNotFoundError } from '../../use-cases/errors/short-code-not-found.error'

export class ShortUrlInMemoryRepository implements ShortUrlRepository {
  private shortUrls: ShortUrl[] = []

  async create(shortUrl: Prisma.ShortUrlCreateInput): Promise<ShortUrl> {
    const newShortUrl: ShortUrl = {
      id: crypto.randomUUID(),
      clicks: 0,
      createdAt: new Date(),
      expiresAt: shortUrl.expiresAt as Date,
      shortCode: shortUrl.shortCode,
      urlId: shortUrl.url.connect?.id ?? '',
    }

    this.shortUrls.push(newShortUrl)

    return newShortUrl
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const shortUrlFound = this.shortUrls.find((shortUrl) => shortUrl.shortCode === shortCode)

    if (!shortUrlFound) {
      return null
    }

    return shortUrlFound
  }

  async addClickToShortUrlByShortUrlCode(shortCode: string): Promise<void> {
    const shortUrl = this.shortUrls.find((s) => s.shortCode === shortCode)

    if (!shortUrl) {
      throw new ShortCodeNotFoundError()
    }

    shortUrl.clicks += 1
  }
}
