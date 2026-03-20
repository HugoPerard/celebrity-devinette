import { getCalendarDateInParis } from '#/lib/puzzle-constants'
import { listPuzzleDatesFromRegistry } from '#/server/puzzle-registry'

export async function listPuzzleDates(): Promise<string[]> {
  return listPuzzleDatesFromRegistry()
}

/** ISO calendar dates (YYYY-MM-DD) sort lexicographically by actual order. */
export function isPuzzleDateReleased(date: string, today = getCalendarDateInParis()): boolean {
  return date <= today
}

/** Dates that exist in the repo and are not after “today” in Europe/Paris. */
export async function listReleasedPuzzleDates(): Promise<string[]> {
  const today = getCalendarDateInParis()
  const dates = await listPuzzleDates()
  return dates.filter((d) => isPuzzleDateReleased(d, today))
}

/**
 * Date of the puzzle to show on the home page:
 * today’s file if present, else latest on/before today. No future puzzles even if files exist.
 */
export async function resolvePuzzleDateForPlay(): Promise<string | null> {
  const today = getCalendarDateInParis()
  const released = await listReleasedPuzzleDates()
  if (released.length === 0) return null
  if (released.includes(today)) return today
  return released[released.length - 1]
}
