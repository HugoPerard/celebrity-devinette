"use client";

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUiState } from "@bearstudio/ui-state";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CircleCheckIcon, ChevronLeftIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitGuess as submitGuessFn } from "#/server/puzzle-fns";
import {
  availableDatesQueryOptions,
  puzzleByDateQueryOptions,
} from "#/lib/puzzle-queries";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSound } from "@/hooks/use-sound";
import { confirmation003Sound } from "@/lib/confirmation-003";
import { error008Sound } from "@/lib/error-008";

export const Route = createFileRoute("/archives")({
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const d = search.date;
    if (d == null || d === "") return {};
    const s = typeof d === "string" ? d : String(d);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return {};
    const parsed = new Date(s + "T12:00:00");
    if (Number.isNaN(parsed.getTime())) return {};
    return { date: s };
  },
  component: ArchivesPage,
});

const STORAGE_KEY = "puzzle-solved";

function isDateSolved(date: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const solved = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    return solved[date] === true;
  } catch {
    return false;
  }
}

function markDateSolved(date: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const solved = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    solved[date] = true;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(solved));
  } catch {
    // ignore
  }
}

function formatDisplayDate(isoDate: string): string {
  return format(new Date(isoDate + "T12:00:00"), "EEEE d MMMM yyyy", {
    locale: fr,
  });
}

function ArchivesPage() {
  const submitGuess = useServerFn(submitGuessFn);
  const navigate = useNavigate();
  const { date: dateParam } = Route.useSearch();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const isoDate = dateParam ?? undefined;
  const selectedDate = isoDate ? new Date(isoDate + "T12:00:00") : undefined;

  const availableDatesQuery = useQuery(availableDatesQueryOptions());
  const puzzleQuery = useQuery({
    ...puzzleByDateQueryOptions(isoDate ?? ""),
    enabled: !!isoDate && isoDate.length > 0,
  });

  const [guess, setGuess] = useState("");
  const [playSuccess] = useSound(confirmation003Sound);
  const [playError] = useSound(error008Sound);
  const submitMutation = useMutation({
    mutationFn: async ({ date, guess }: { date: string; guess: string }) => {
      const result = await submitGuess({ data: { date, guess } });
      return { ...result, date };
    },
    onSuccess: (data) => {
      if (data.ok) {
        markDateSolved(data.date);
        playSuccess();
      } else {
        playError();
      }
    },
    onError: () => {
      playError();
    },
  });

  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
  };

  const handleSelectDate = (date: Date | undefined) => {
    navigate({
      to: "/archives",
      search: date ? { date: format(date, "yyyy-MM-dd") } : {},
    });
    setPopoverOpen(false);
    setGuess("");
    submitMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzleQuery.data) return;
    submitMutation.mutate({ date: puzzleQuery.data.date, guess });
  };

  const minDate = availableDatesQuery.data?.[0]
    ? new Date(availableDatesQuery.data[0] + "T12:00:00")
    : undefined;
  const maxDate =
    availableDatesQuery.data && availableDatesQuery.data.length > 0
      ? new Date(
          availableDatesQuery.data[availableDatesQuery.data.length - 1] +
            "T12:00:00",
        )
      : undefined;

  const ui = getUiState((set) => {
    if (!selectedDate) return set("no-date");
    if (puzzleQuery.status === "pending") return set("loading");
    if (puzzleQuery.status === "error") return set("error");
    const puzzle = puzzleQuery.data;
    if (!puzzle) return set("not-found", { selectedDate });
    const solved =
      isDateSolved(puzzle.date) ||
      (submitMutation.isSuccess && submitMutation.data?.ok);
    if (solved) return set("success", { puzzle });
    if (submitMutation.isSuccess && !submitMutation.data?.ok)
      return set("wrong", { puzzle });
    return set("form", { puzzle });
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-12 sm:pt-14">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Archives
          </p>
          <Popover open={popoverOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger>
              <Button
                className="w-fit justify-start text-left font-normal sm:w-[280px]"
                variant="outline"
              >
                <CalendarIcon aria-hidden className="size-4 opacity-80" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverPopup align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                defaultMonth={selectedDate ?? maxDate ?? minDate ?? new Date()}
                disabled={(d) =>
                  (availableDatesQuery.data?.length ?? 0) > 0 &&
                  !availableDatesQuery.data?.includes(format(d, "yyyy-MM-dd"))
                }
                fromDate={minDate}
                toDate={maxDate}
              />
            </PopoverPopup>
          </Popover>
        </div>

        {ui
          .match("no-date", () => (
            <div className="mx-auto mb-8 flex aspect-square max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/50 sm:max-w-[400px]">
              <p className="text-sm text-muted-foreground">Choisis une date</p>
            </div>
          ))
          .match("loading", () => (
            <>
              <Skeleton className="mx-auto mb-4 h-4 w-40" />
              <div className="mx-auto mb-8 aspect-square max-w-sm overflow-hidden rounded-2xl sm:max-w-[400px]">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="mx-auto flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-lg sm:h-10" />
                </div>
                <Skeleton className="mt-1 h-10 w-full rounded-lg" />
              </div>
            </>
          ))
          .match("error", () => (
            <Alert variant="error" className="mb-8">
              <AlertDescription>
                Impossible de charger la devinette. Réessaie plus tard.
              </AlertDescription>
            </Alert>
          ))
          .match("not-found", ({ selectedDate }) => (
            <Alert variant="default" className="mb-8">
              <AlertDescription>
                Aucune devinette pour le{" "}
                {format(selectedDate, "d MMMM yyyy", { locale: fr })}.
              </AlertDescription>
            </Alert>
          ))
          .match("success", ({ puzzle }) => (
            <>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                <span className="font-medium capitalize text-foreground">
                  {formatDisplayDate(puzzle.date)}
                </span>
              </p>
              <div className="mx-auto mb-8 aspect-square max-w-sm overflow-hidden rounded-2xl border border-border/80 bg-muted ring-1 ring-black/5 sm:max-w-[400px]">
                <img
                  src={puzzle.imagePath}
                  alt="Indice visuel pour la devinette"
                  className="h-full w-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <Alert variant="success" className="mb-8">
                <CircleCheckIcon aria-hidden className="size-4 shrink-0" />
                <AlertTitle>Bravo — bonne réponse !</AlertTitle>
                <AlertDescription>
                  Tu as déjà trouvé cette devinette.
                </AlertDescription>
              </Alert>
            </>
          ))
          .match("wrong", ({ puzzle }) => (
            <ArchivesPuzzleForm
              puzzle={puzzle}
              guess={guess}
              setGuess={setGuess}
              onSubmit={handleSubmit}
              submitMutation={submitMutation}
              variant="wrong"
            />
          ))
          .match("form", ({ puzzle }) => (
            <ArchivesPuzzleForm
              puzzle={puzzle}
              guess={guess}
              setGuess={setGuess}
              onSubmit={handleSubmit}
              submitMutation={submitMutation}
              variant="form"
            />
          ))
          .exhaustive()}

        <p className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeftIcon aria-hidden className="size-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </p>
      </div>
    </main>
  );
}

function ArchivesPuzzleForm({
  puzzle,
  guess,
  setGuess,
  onSubmit,
  submitMutation,
  variant,
}: {
  puzzle: { date: string; imagePath: string };
  guess: string;
  setGuess: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitMutation: {
    mutate: (v: { date: string; guess: string }) => void;
    isPending: boolean;
    isError: boolean;
    reset: () => void;
  };
  variant: "form" | "wrong";
}) {
  return (
    <>
      <p className="mb-4 text-center text-sm text-muted-foreground">
        <span className="font-medium capitalize text-foreground">
          {formatDisplayDate(puzzle.date)}
        </span>
      </p>
      <div className="mx-auto mb-8 aspect-square max-w-sm overflow-hidden rounded-2xl border border-border/80 bg-muted ring-1 ring-black/5 sm:max-w-[400px]">
        <img
          src={puzzle.imagePath}
          alt="Indice visuel pour la devinette"
          className="h-full w-full object-cover"
          width={400}
          height={400}
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-md flex-col gap-4"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          Ta réponse
          <Input
            nativeInput
            placeholder="Prénom et nom…"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              submitMutation.reset();
            }}
            disabled={submitMutation.isPending}
            autoComplete="off"
            className="h-11 sm:h-10"
          />
        </label>
        {variant === "wrong" && (
          <Alert variant="warning">
            <AlertDescription>
              Ce n'est pas ça — encore un essai ?
            </AlertDescription>
          </Alert>
        )}
        {submitMutation.isError && (
          <Alert variant="error">
            <AlertDescription>
              Impossible de valider pour le moment.
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={submitMutation.isPending || !guess.trim()}
          loading={submitMutation.isPending}
          className="mt-1"
        >
          {submitMutation.isPending ? "Vérification…" : "Valider"}
        </Button>
      </form>
    </>
  );
}
