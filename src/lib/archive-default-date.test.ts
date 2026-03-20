import { describe, expect, it, vi } from "vitest";

vi.mock("#/lib/puzzle-constants", () => ({
  getCalendarDateInParis: () => "2026-03-20",
}));

import { isoCalendarAddDays, pickDefaultArchiveDate } from "./archive-default-date";

describe("isoCalendarAddDays", () => {
  it("subtracts one calendar day", () => {
    expect(isoCalendarAddDays("2026-03-20", -1)).toBe("2026-03-19");
  });

  it("handles month boundaries", () => {
    expect(isoCalendarAddDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("pickDefaultArchiveDate", () => {
  it("returns yesterday when it exists in the list", () => {
    const dates = ["2026-03-10", "2026-03-18", "2026-03-19", "2026-03-20"];
    expect(pickDefaultArchiveDate(dates)).toBe("2026-03-19");
  });

  it("falls back to latest on or before yesterday when yesterday is missing", () => {
    const dates = ["2026-03-14", "2026-03-16", "2026-03-20"];
    expect(pickDefaultArchiveDate(dates)).toBe("2026-03-16");
  });
});
