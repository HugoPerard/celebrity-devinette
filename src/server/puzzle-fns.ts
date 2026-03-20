import { createServerFn } from '@tanstack/react-start'
import { normalizeGuess } from '#/lib/normalize-guess'
import { type PuzzlePublic } from '#/lib/puzzle-schema'
import {
  isPuzzleDateReleased,
  listReleasedPuzzleDates,
  resolvePuzzleDateForPlay,
} from '#/server/puzzle-dates'
import { getPuzzleFile } from '#/server/puzzle-registry'

function loadPuzzleFile(date: string) {
  const puzzle = getPuzzleFile(date)
  if (!puzzle) throw new Error('Invalid puzzle file')
  return puzzle
}

function toPublic(puzzle: Awaited<ReturnType<typeof loadPuzzleFile>>): PuzzlePublic {
  return {
    date: puzzle.date,
    imagePath: puzzle.imagePath,
  }
}

export const getTodayPuzzlePublic = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PuzzlePublic | null> => {
    const date = await resolvePuzzleDateForPlay()
    if (!date) return null
    const puzzle = await loadPuzzleFile(date)
    return toPublic(puzzle)
  },
)

export const getPuzzleByDate = createServerFn({ method: 'GET' })
  .inputValidator((d: { date: string }) => d)
  .handler(async ({ data }): Promise<PuzzlePublic | null> => {
    if (!isPuzzleDateReleased(data.date)) return null
    const puzzle = getPuzzleFile(data.date)
    if (!puzzle) return null
    return toPublic(puzzle)
  })

export const listAvailableDates = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => listReleasedPuzzleDates(),
)

export const submitGuess = createServerFn({ method: 'POST' })
  .inputValidator((d: { date: string; guess: string }) => d)
  .handler(async ({ data }) => {
    if (!isPuzzleDateReleased(data.date)) return { ok: false } as const
    const puzzle = await loadPuzzleFile(data.date)
    const g = normalizeGuess(data.guess)
    const ok = g.length > 0 && g === puzzle.answerNormalized
    return { ok } as const
  })
