import { z } from 'zod'

/** Full puzzle record as stored in content/puzzles/YYYY-MM-DD.json */
export const puzzleFileSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  imagePath: z
    .string()
    .min(1)
    .refine((p) => p.startsWith('/puzzles/'), {
      message: 'imagePath must be under /puzzles/',
    })
    .refine((p) => !/\.svg$/i.test(p), {
      message: 'imagePath must be a raster image (.png, .webp, .jpg, …), not .svg',
    }),
  /** Lowercase, no accents, single spaces between tokens (see normalizeGuess). */
  answerNormalized: z.string().min(1),
  celebrityPublicName: z.string().optional(),
})

export type PuzzleFile = z.infer<typeof puzzleFileSchema>

/** Safe to send to the client */
export type PuzzlePublic = Pick<PuzzleFile, 'date' | 'imagePath'>
