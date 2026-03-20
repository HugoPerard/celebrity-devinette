import { getCalendarDateInParis } from '#/lib/puzzle-constants'
import { listPuzzleDatesFromRegistry } from '#/server/puzzle-registry'

export async function listPuzzleDates(): Promise<string[]> {
  return listPuzzleDatesFromRegistry()
}

/**
 * Date of the puzzle to show on the home page:
 * today’s file if present, else latest on/before today, else latest in repo (dev fallback).
 */
export async function resolvePuzzleDateForPlay(): Promise<string | null> {
  const today = getCalendarDateInParis()
  const dates = await listPuzzleDates()
  if (dates.length === 0) return null
  if (dates.includes(today)) return today
  const onOrBefore = dates.filter((d) => d <= today)
  if (onOrBefore.length > 0) return onOrBefore[onOrBefore.length - 1]
  return dates[dates.length - 1]
}
