import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UrlInMemoryRepository } from '../repositories/in-memory/url-in-memory-repository'
import { ShortUrlInMemoryRepository } from '../repositories/in-memory/short-url-prisma-in-memory-repository'
import { FindUrlOriginalByShortUrlUseCase } from './find-url-original-by-short-url-use-case'
import { CreateShortUrlUseCase } from './create-short-url-use-case'
import { CreateUrlEncodedUseCase } from './create-url-encoded'
import { ShortCodeNotFoundError } from './errors/short-code-not-found.error'
import { ShortUrlExpiredError } from './errors/short-url-expired.error'
import { UrlNotFoundError } from './errors/url-not-found.error'

describe('FindUrlOriginalByShortUrlUseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to find a url original by short url', async () => {
    const ORIGINAL_URL = 'https://www.google.com'
    const urlRepository = new UrlInMemoryRepository()
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(urlRepository, shortUrlRepository)
    const createShortUrlUseCase = new CreateShortUrlUseCase()

    const { shortCode } = createShortUrlUseCase.execute()
    const { urlEncoded } = await createUrlEncodedUseCase.execute({
      url: ORIGINAL_URL,
      shortCode,
    })

    const findUrlOriginalByShortUrlUseCase = new FindUrlOriginalByShortUrlUseCase(
      shortUrlRepository,
      urlRepository
    )

    const urlOriginal = await findUrlOriginalByShortUrlUseCase.execute(shortCode)

    expect(urlEncoded).toContain(shortCode)
    expect(urlOriginal?.url).toBe(ORIGINAL_URL)
  })

  it('should not be able to find a url original by short url if the short url does not exist', async () => {
    const ORIGINAL_URL = 'https://www.google.com'
    const WRONG_SHORT_CODE = '123456'
    const urlRepository = new UrlInMemoryRepository()
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(urlRepository, shortUrlRepository)
    const createShortUrlUseCase = new CreateShortUrlUseCase()

    const { shortCode } = createShortUrlUseCase.execute()
    await createUrlEncodedUseCase.execute({
      url: ORIGINAL_URL,
      shortCode,
    })

    const findUrlOriginalByShortUrlUseCase = new FindUrlOriginalByShortUrlUseCase(
      shortUrlRepository,
      urlRepository
    )

    expect(
      async () => await findUrlOriginalByShortUrlUseCase.execute(WRONG_SHORT_CODE)
    ).rejects.toThrow(new ShortCodeNotFoundError())
  })

  it('should not be able to find a url original by short url if the short url is expired', async () => {
    const ORIGINAL_URL = 'https://www.google.com'
    const EXPIRATION_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1) // 7 days + 1 second
    const urlRepository = new UrlInMemoryRepository()
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(urlRepository, shortUrlRepository)
    const createShortUrlUseCase = new CreateShortUrlUseCase()

    const { shortCode } = createShortUrlUseCase.execute()
    await createUrlEncodedUseCase.execute({
      url: ORIGINAL_URL,
      shortCode,
    })

    const findUrlOriginalByShortUrlUseCase = new FindUrlOriginalByShortUrlUseCase(
      shortUrlRepository,
      urlRepository
    )

    vi.setSystemTime(new Date(EXPIRATION_DATE))

    await expect(
      async () => await findUrlOriginalByShortUrlUseCase.execute(shortCode)
    ).rejects.toThrow(new ShortUrlExpiredError())
  })

  it('should not be able to find a url original by short url if the short url is not found', async () => {
    const shortUrlRepo = new ShortUrlInMemoryRepository()
    vi.spyOn(shortUrlRepo, 'findByShortCode').mockResolvedValue({
      id: 'short-123',
      urlId: 'url-123',
      expiresAt: new Date(Date.now() + 10000),
      clicks: 0,
      createdAt: new Date(),
      shortCode: 'abc123',
    })

    const urlRepo = new UrlInMemoryRepository()
    vi.spyOn(urlRepo, 'getUrlById').mockResolvedValue(null)

    const useCase = new FindUrlOriginalByShortUrlUseCase(shortUrlRepo, urlRepo)

    await expect(useCase.execute('abc123')).rejects.toThrow(new UrlNotFoundError())
  })
})
