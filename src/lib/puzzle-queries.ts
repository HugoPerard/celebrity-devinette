import { queryOptions } from "@tanstack/react-query";
import {
  getTodayPuzzlePublic,
  getPuzzleByDate,
  listAvailableDates,
} from "#/server/puzzle-fns";

export const todayPuzzleQueryOptions = () =>
  queryOptions({
    queryKey: ["puzzle", "today"] as const,
    queryFn: () => getTodayPuzzlePublic(),
  });

export const puzzleByDateQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ["puzzle", date] as const,
    queryFn: () => getPuzzleByDate({ data: { date } }),
  });

export const availableDatesQueryOptions = () =>
  queryOptions({
    queryKey: ["puzzle", "dates"] as const,
    queryFn: () => listAvailableDates(),
  });
