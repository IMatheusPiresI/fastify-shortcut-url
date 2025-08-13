import z from 'zod'

export const redirectShortUrlSchema = z.object({
  shortCode: z.string(),
})
