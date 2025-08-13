import { Url } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { UrlRepository } from '../url-repository'

export class UrlPrismaRepository implements UrlRepository {
  async getUrlByOriginalUrl(url: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: { url },
    })
  }

  async createUrl(url: Url): Promise<Url> {
    return prisma.url.create({
      data: {
        ...url,
      },
    })
  }

  async getUrlById(id: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: { id },
    })
  }
}
