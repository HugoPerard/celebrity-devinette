"use client";

import { useState } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUiState } from "@bearstudio/ui-state";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDownIcon, CircleCheckIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import {
  listAvailableDates,
  submitGuess as submitGuessFn,
} from "#/server/puzzle-fns";
import { pickDefaultArchiveDate } from "#/lib/archive-default-date";
import {
  availableDatesQueryOptions,
  puzzleByDateQueryOptions,
} from "#/lib/puzzle-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LoadingPuzzleHint,
} from "@/components/loading-puzzle-hint";
import { PuzzleImage } from "@/components/puzzle-image";
import { ArchiveCalendarModal } from "@/components/archive-calendar-modal";
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
  beforeLoad: async ({ search }) => {
    if (search.date) return;
    const dates = await listAvailableDates();
    const d = pickDefaultArchiveDate(dates);
    if (d) throw redirect({ to: "/archives", search: { date: d } });
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

  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const handleSelectDate = (date: Date | undefined) => {
    navigate({
      to: "/archives",
      search: date ? { date: format(date, "yyyy-MM-dd") } : {},
    });
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
    <main className="page-atmosphere mx-auto w-full max-w-4xl">
      <div className="content-panel min-w-0">
        <p className="type-overline mb-2 text-center">Archives</p>
        <p className="mb-8 text-center">
          {isoDate ? (
            <button
              type="button"
              className="type-date-hero glass-date-pill inline-flex cursor-pointer items-center gap-2"
              aria-haspopup="dialog"
              aria-expanded={calendarOpen}
              aria-label={`Choisir une autre date. ${formatDisplayDate(isoDate)}`}
              onClick={() => setCalendarOpen(true)}
            >
              <span>{formatDisplayDate(isoDate)}</span>
              <ChevronDownIcon
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${calendarOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          ) : (
            <span className="type-date-hero text-muted-foreground">—</span>
          )}
        </p>

        <ArchiveCalendarModal
          open={calendarOpen}
          onOpenChange={setCalendarOpen}
          selectedDate={selectedDate}
          availableDates={availableDatesQuery.data}
          minDate={minDate}
          maxDate={maxDate}
          onSelectDate={handleSelectDate}
          isDateSolved={isDateSolved}
        />

        {ui
          .match("no-date", () => (
            <div className="puzzle-frame-empty">
              <p className="type-body-muted-sm px-4 text-center">
                Aucune devinette publiée pour le moment.
              </p>
            </div>
          ))
          .match("loading", () => (
            <>
              <div className="puzzle-frame">
                <Skeleton className="size-full" />
              </div>
              <div className="mx-auto flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-2xl sm:h-10" />
                </div>
                <Skeleton className="mt-1 h-10 w-full rounded-full" />
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
            <div className="motion-safe:animate-success-pop motion-reduce:animate-none">
              <div className="puzzle-frame">
                <PuzzleImage
                  src={puzzle.imagePath}
                  alt="Indice visuel pour la devinette"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
              <Alert variant="success" className="mb-8">
                <CircleCheckIcon aria-hidden className="size-4 shrink-0" />
                <AlertTitle>Chapeau — c'est la bonne réponse !</AlertTitle>
                <AlertDescription>
                  Tu as déjà trouvé cette devinette.
                </AlertDescription>
              </Alert>
            </div>
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

        <p className="type-body-muted-sm mx-auto mt-10 max-w-[42ch] text-balance text-center">
          Trouve le jeu de mots sur le nom de la célébrité à partir de l'image.
          Rattrape les devinettes qui t'ont échappées en parcourant les archives.
        </p>
        <p className="mt-6 text-center">
          <Link to="/" className="type-link-subtle">
            <span>Retour à l'accueil</span>
            <span aria-hidden>→</span>
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
      <div className="puzzle-frame">
        <PuzzleImage
          src={puzzle.imagePath}
          alt="Indice visuel pour la devinette"
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-md flex-col gap-4"
      >
        <label className="type-label flex flex-col gap-2">
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
              Pas cette fois — un autre essai ?
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
          {submitMutation.isPending ? "Vérification de ta réponse…" : "Valider"}
        </Button>
      </form>
    </>
  );
}
