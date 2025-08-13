import z from 'zod'

export const encodeUrlSchema = z.object({
  url: z.string().refine((url) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }),
})
