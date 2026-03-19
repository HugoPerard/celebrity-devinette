import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createServerFn } from '@tanstack/react-start'
import { normalizeGuess } from '#/lib/normalize-guess'
import { puzzleFileSchema, type PuzzlePublic } from '#/lib/puzzle-schema'
import {
  listPuzzleDates,
  puzzlesDir,
  resolvePuzzleDateForPlay,
} from '#/server/puzzle-dates'

async function loadPuzzleFile(date: string) {
  const path = join(puzzlesDir(), `${date}.json`)
  const raw = await readFile(path, 'utf-8')
  const parsed = puzzleFileSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    console.error(parsed.error.flatten())
    throw new Error('Invalid puzzle file')
  }
  return parsed.data
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
    const dates = await listPuzzleDates()
    if (!dates.includes(data.date)) return null
    const puzzle = await loadPuzzleFile(data.date)
    return toPublic(puzzle)
  })

export const listAvailableDates = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => listPuzzleDates(),
)

export const submitGuess = createServerFn({ method: 'POST' })
  .inputValidator((d: { date: string; guess: string }) => d)
  .handler(async ({ data }) => {
    const puzzle = await loadPuzzleFile(data.date)
    const g = normalizeGuess(data.guess)
    const ok = g.length > 0 && g === puzzle.answerNormalized
    return { ok } as const
  })
