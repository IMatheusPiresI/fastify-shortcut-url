export class ShortCodeAlreadyExistsError extends Error {
  constructor() {
    super('Short code already exists')
  }
}
