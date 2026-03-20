import { getCalendarDateInParis } from "#/lib/puzzle-constants";

/** Pure calendar arithmetic on YYYY-MM-DD (no timezone instant). */
export function isoCalendarAddDays(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * Default archive day: yesterday (Paris) if a puzzle exists, else the latest
 * released date on or before yesterday; if none, the latest released date.
 */
export function pickDefaultArchiveDate(availableDates: string[]): string | null {
  if (availableDates.length === 0) return null;
  const sorted = [...availableDates].sort();
  const today = getCalendarDateInParis();
  const yesterday = isoCalendarAddDays(today, -1);
  if (sorted.includes(yesterday)) return yesterday;
  const onOrBeforeYesterday = sorted.filter((d) => d <= yesterday);
  if (onOrBeforeYesterday.length > 0) {
    return onOrBeforeYesterday[onOrBeforeYesterday.length - 1];
  }
  return sorted[sorted.length - 1];
}
