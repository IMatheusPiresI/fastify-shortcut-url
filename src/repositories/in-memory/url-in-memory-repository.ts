import { Prisma, Url } from '@prisma/client'
import { UrlRepository } from '../url-repository'

export class UrlInMemoryRepository implements UrlRepository {
  private urls: Url[] = []

  async createUrl(data: Prisma.UrlCreateInput): Promise<Url> {
    const newUrl = { id: crypto.randomUUID(), url: data.url, createdAt: new Date() }
    this.urls.push(newUrl)

    return newUrl
  }

  async getUrlByOriginalUrl(url: string): Promise<Url | null> {
    const urlFound = this.urls.find((urlFound) => urlFound.url === url)

    if (!urlFound) {
      return null
    }

    return urlFound
  }

  async getUrlById(id: string): Promise<Url | null> {
    const urlFound = this.urls.find((url) => url.id === id)

    if (!urlFound) {
      return null
    }

    return urlFound
  }
}
