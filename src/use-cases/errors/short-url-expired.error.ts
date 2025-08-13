export class ShortUrlExpiredError extends Error {
  constructor() {
    super('Short URL expired')
  }
}
