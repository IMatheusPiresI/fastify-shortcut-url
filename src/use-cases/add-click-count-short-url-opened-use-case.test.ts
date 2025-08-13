import { describe, expect, it } from 'vitest'
import { ShortUrlInMemoryRepository } from '../repositories/in-memory/short-url-prisma-in-memory-repository'

import { UrlInMemoryRepository } from '../repositories/in-memory/url-in-memory-repository'
import { CreateShortUrlUseCase } from './create-short-url-use-case'
import { CreateUrlEncodedUseCase } from './create-url-encoded'
import { AddClickCountShortUrlOpenedUseCase } from './add-click-count-short-url-opened-use-case'
import { ShortCodeNotFoundError } from './errors/short-code-not-found.error'

describe('Add click count short url opened use case', () => {
  it('should be able to add click count to short url', async () => {
    const urlRepository = new UrlInMemoryRepository()
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const createShortUrl = new CreateUrlEncodedUseCase(urlRepository, shortUrlRepository)
    const createShortUrlUseCase = new CreateShortUrlUseCase()

    const { shortCode } = createShortUrlUseCase.execute()

    await createShortUrl.execute({
      url: 'https://www.google.com',
      shortCode,
    })

    const addClickCountShortUrlOpenedUseCase = new AddClickCountShortUrlOpenedUseCase(
      shortUrlRepository
    )

    await addClickCountShortUrlOpenedUseCase.execute(shortCode)

    const shortUrl = await shortUrlRepository.findByShortCode(shortCode)

    expect(shortUrl?.clicks).toBe(1)
  })

  it('should not be able to add click count to short url if the short url does not exist', async () => {
    const shortUrlRepository = new ShortUrlInMemoryRepository()

    const addClickCountShortUrlOpenedUseCase = new AddClickCountShortUrlOpenedUseCase(
      shortUrlRepository
    )

    expect(
      async () => await addClickCountShortUrlOpenedUseCase.execute('short-code-not-found')
    ).rejects.toThrow(new ShortCodeNotFoundError())
  })
})
