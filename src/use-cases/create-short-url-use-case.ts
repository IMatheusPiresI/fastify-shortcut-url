import crypto from 'crypto'
import { env } from '../env'

export class CreateShortUrlUseCase {
  execute() {
    const shortCode = crypto.randomBytes(6).toString('hex')

    return {
      shortCode,
    }
  }
}
