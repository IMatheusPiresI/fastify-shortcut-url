import { describe, expect, it } from 'vitest'
import { UrlInMemoryRepository } from '../repositories/in-memory/url-in-memory-repository'
import { CreateUrlEncodedUseCase } from './create-url-encoded'
import { ShortUrlInMemoryRepository } from '../repositories/in-memory/short-url-prisma-in-memory-repository'
import { CreateShortUrlUseCase } from './create-short-url-use-case'
import { _env } from '../env'

describe('CreateShortUrlUseCase', () => {
  it('should be able to create a short url', async () => {
    const urlRepository = new UrlInMemoryRepository()
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const createShortUrlUseCase = new CreateShortUrlUseCase()
    const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(urlRepository, shortUrlRepository)

    const { shortCode } = createShortUrlUseCase.execute()

    createUrlEncodedUseCase.execute({
      url: 'https://www.google.com',
      shortCode,
    })

    const { urlEncoded } = await createUrlEncodedUseCase.execute({
      url: 'https://www.google.com',
      shortCode,
    })

    expect(urlEncoded).includes(shortCode)
    expect(urlEncoded).includes(_env.DOMAIN)
    expect(urlEncoded).toBe(`${_env.DOMAIN}/${shortCode}`)
  })
})
