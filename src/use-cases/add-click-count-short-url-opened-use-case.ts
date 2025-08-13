import { ShortUrlRepository } from '../repositories/short-url-repository'

export class AddClickCountShortUrlOpenedUseCase {
  private readonly shortUrlRepository: ShortUrlRepository

  constructor(shortUrlRepository: ShortUrlRepository) {
    this.shortUrlRepository = shortUrlRepository
  }

  async execute(shortCode: string): Promise<void> {
    await this.shortUrlRepository.addClickToShortUrlByShortUrlCode(shortCode)
  }
}
