import { describe, expect, it } from 'vitest'
import { UrlInMemoryRepository } from '../repositories/in-memory/url-in-memory-repository'
import { ShortUrlInMemoryRepository } from '../repositories/in-memory/short-url-prisma-in-memory-repository'
import { CreateUrlEncodedUseCase } from './create-url-encoded'
import { CreateShortUrlUseCase } from './create-short-url-use-case'
import { _env } from '../env'
import { ShortCodeAlreadyExistsError } from './errors/short-code-already-exists.error'

describe('CreateUrlEncodedUseCase', () => {
  const createUrlEncoded = async (
    urlInMemoryRepository: UrlInMemoryRepository,
    shortUrlInMemoryRepository: ShortUrlInMemoryRepository,
    customShortCode?: string
  ) => {
    const createUrlEncodedUseCase = new CreateUrlEncodedUseCase(
      urlInMemoryRepository,
      shortUrlInMemoryRepository
    )
    const createShortUrlUseCase = new CreateShortUrlUseCase()

    const { shortCode } = customShortCode
      ? { shortCode: customShortCode }
      : createShortUrlUseCase.execute()

    const { urlEncoded } = await createUrlEncodedUseCase.execute({
      url: 'https://www.google.com',
      shortCode,
    })

    return { urlEncoded, shortCode }
  }
  it('should be able to create a url encoded', async () => {
    const urlInMemoryRepository = new UrlInMemoryRepository()
    const shortUrlInMemoryRepository = new ShortUrlInMemoryRepository()

    const { urlEncoded, shortCode } = await createUrlEncoded(
      urlInMemoryRepository,
      shortUrlInMemoryRepository
    )

    expect(urlEncoded).includes(shortCode)
    expect(urlEncoded).includes(_env.DOMAIN)
    expect(urlEncoded).toBe(`${_env.DOMAIN}/${shortCode}`)
  })

  it('should not be able to create a url encoded if the url already exists and use another short code', async () => {
    const urlInMemoryRepository = new UrlInMemoryRepository()
    const shortUrlInMemoryRepository = new ShortUrlInMemoryRepository()

    const { urlEncoded, shortCode } = await createUrlEncoded(
      urlInMemoryRepository,
      shortUrlInMemoryRepository
    )

    const { urlEncoded: urlEncoded2, shortCode: shortCode2 } = await createUrlEncoded(
      urlInMemoryRepository,
      shortUrlInMemoryRepository
    )

    const shortUrl = await shortUrlInMemoryRepository.findByShortCode(shortCode)
    const shortUrl2 = await shortUrlInMemoryRepository.findByShortCode(shortCode2)

    const url = await urlInMemoryRepository.getUrlById(shortUrl?.urlId ?? '')
    const url2 = await urlInMemoryRepository.getUrlById(shortUrl2?.urlId ?? '')

    expect(url?.id).toBe(url2?.id)
    expect(urlEncoded).not.toBe(urlEncoded2)
  })

  it('should not be able to create a url encoded if the url already exists and use the same short code', async () => {
    const urlInMemoryRepository = new UrlInMemoryRepository()
    const shortUrlInMemoryRepository = new ShortUrlInMemoryRepository()

    const { shortCode } = await createUrlEncoded(urlInMemoryRepository, shortUrlInMemoryRepository)

    await expect(
      createUrlEncoded(urlInMemoryRepository, shortUrlInMemoryRepository, shortCode)
    ).rejects.toThrow(new ShortCodeAlreadyExistsError())
  })

  it('should be not get url on id if the url does not exist', async () => {
    const urlInMemoryRepository = new UrlInMemoryRepository()
    const shortUrlInMemoryRepository = new ShortUrlInMemoryRepository()
    const WRONG_ID = 'wrong-id'

    await createUrlEncoded(urlInMemoryRepository, shortUrlInMemoryRepository)

    const url = await urlInMemoryRepository.getUrlById(WRONG_ID)

    expect(url).toBeNull()
  })
})
