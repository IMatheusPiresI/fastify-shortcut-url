import { Prisma, ShortUrl } from '@prisma/client'
import { ShortUrlRepository } from '../short-url-repository'
import { prisma } from '../../lib/prisma'

export class ShortUrlPrismaRepository implements ShortUrlRepository {
  async create(data: Prisma.ShortUrlCreateInput): Promise<ShortUrl> {
    const shortUrl = await prisma.shortUrl.create({
      data,
    })
    return shortUrl
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { shortCode },
    })
    return shortUrl
  }

  async addClickToShortUrlByShortUrlCode(shortCode: string): Promise<void> {
    await prisma.shortUrl.update({
      where: { shortCode: shortCode },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })
  }
}
