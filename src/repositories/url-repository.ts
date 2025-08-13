import { Prisma, Url } from '@prisma/client'

export interface UrlRepository {
  createUrl(data: Prisma.UrlCreateInput): Promise<Url>
  getUrlByOriginalUrl(url: string): Promise<Url | null>
  getUrlById(id: string): Promise<Url | null>
}
