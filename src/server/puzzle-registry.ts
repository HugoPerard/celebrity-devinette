import { puzzleFileSchema, type PuzzleFile } from '#/lib/puzzle-schema'

/** Bundled at build time so puzzles work on serverless (no filesystem at runtime). */
const rawByPath = import.meta.glob('../../content/puzzles/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const puzzleByDate = new Map<string, PuzzleFile>()

for (const [path, data] of Object.entries(rawByPath)) {
  const base = path.split('/').pop()?.replace(/\.json$/i, '') ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(base)) continue
  const parsed = puzzleFileSchema.safeParse(data)
  if (!parsed.success) {
    console.error(`Invalid puzzle file ${path}:`, parsed.error.flatten())
    continue
  }
  puzzleByDate.set(base, parsed.data)
}

export function listPuzzleDatesFromRegistry(): string[] {
  return [...puzzleByDate.keys()].sort()
}

export function getPuzzleFile(date: string): PuzzleFile | undefined {
  return puzzleByDate.get(date)
}
