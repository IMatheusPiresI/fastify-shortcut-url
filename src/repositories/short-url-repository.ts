import { Prisma, ShortUrl } from '@prisma/client'

export interface ShortUrlRepository {
  create(shortUrl: Prisma.ShortUrlCreateInput): Promise<ShortUrl>
  findByShortCode(shortCode: string): Promise<ShortUrl | null>
  addClickToShortUrlByShortUrlCode(shortUrlId: string): Promise<void>
}
