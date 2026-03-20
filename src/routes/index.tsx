import { useLayoutEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUiState } from "@bearstudio/ui-state";
import { CircleCheckIcon } from "lucide-react";
import { submitGuess as submitGuessFn } from "#/server/puzzle-fns";
import { queryClient } from "#/lib/query-client";
import { todayPuzzleQueryOptions } from "#/lib/puzzle-queries";
import { useServerFn } from "@tanstack/react-start";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingPuzzleHint } from "@/components/loading-puzzle-hint";
import { PuzzleImage } from "@/components/puzzle-image";
import { useSound } from "@/hooks/use-sound";
import { confirmation003Sound } from "@/lib/confirmation-003";
import { error008Sound } from "@/lib/error-008";

const STORAGE_KEY = "puzzle-solved";

function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
    // ignore storage errors
  }
}

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await queryClient.ensureQueryData(todayPuzzleQueryOptions());
    return data;
  },
  component: Home,
});

function PuzzlePageHowTo() {
  return (
    <p className="type-body-muted-sm mx-auto mt-10 max-w-[42ch] text-balance text-center">
      Trouve le jeu de mots sur le nom de la célébrité à partir de l'image.
    </p>
  );
}

function Home() {
  const loaderData = Route.useLoaderData();
  const puzzleQuery = useQuery({
    ...todayPuzzleQueryOptions(),
    initialData: loaderData,
  });
  const submitGuess = useServerFn(submitGuessFn);
  const [guess, setGuess] = useState("");
  const [solvedFromStorage, setSolvedFromStorage] = useState(false);
  const [playSuccess] = useSound(confirmation003Sound);
  const [playError] = useSound(error008Sound);

  useLayoutEffect(() => {
    if (puzzleQuery.data && isDateSolved(puzzleQuery.data.date)) {
      setSolvedFromStorage(true);
    }
  }, [puzzleQuery.data?.date]);

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

  const ui = getUiState((set) => {
    if (puzzleQuery.isPending && !puzzleQuery.data) return set("pending");
    if (puzzleQuery.isError) return set("error");
    const puzzle = puzzleQuery.data;
    if (!puzzle) return set("no-puzzle");
    const solved =
      solvedFromStorage ||
      (submitMutation.isSuccess && submitMutation.data?.ok);
    if (solved) return set("success", { puzzle });
    if (submitMutation.isSuccess && !submitMutation.data?.ok)
      return set("wrong", { puzzle });
    return set("form", { puzzle });
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!puzzleQuery.data) return;
    submitMutation.mutate({ date: puzzleQuery.data.date, guess });
  }

  return ui
    .match("pending", () => (
      <main className="page-atmosphere mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
        <div className="content-panel content-panel--compact w-full max-w-lg">
          <LoadingPuzzleHint />
        </div>
      </main>
    ))
    .match("error", () => (
      <main className="page-atmosphere mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
        <div className="content-panel content-panel--compact m-auto w-full max-w-lg text-center">
          <h2 className="type-page-title mb-3">Erreur de chargement</h2>
          <p className="type-body-muted mx-auto max-w-[65ch]">
            Impossible de charger la devinette. Réessaie plus tard.
          </p>
          <Link to="/archives" className="type-link-subtle mt-8">
            Voir les archives
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    ))
    .match("no-puzzle", () => (
      <main className="page-atmosphere mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
        <div className="content-panel content-panel--compact m-auto w-full max-w-lg text-center">
          <h2 className="type-page-title mb-3">
            Aucune devinette pour l'instant
          </h2>
          <p className="type-body-muted mx-auto max-w-[65ch]">
            Ajoute{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
              content/puzzles/YYYY-MM-DD.json
            </code>{" "}
            et l'image sous{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
              public/puzzles/
            </code>
            .
          </p>
          <Link to="/archives" className="type-link-subtle mt-8">
            Voir les archives
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    ))
    .match("success", ({ puzzle }) => (
      <main className="page-atmosphere mx-auto w-full max-w-4xl">
        <div className="content-panel motion-safe:animate-success-pop motion-reduce:animate-none">
          <p className="type-overline mb-2 text-center">Aujourd'hui</p>
          <p className="mb-8 text-center">
            <span className="type-date-hero glass-date-pill cursor-default">
              {formatDisplayDate(puzzle.date)}
            </span>
          </p>
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
              Rendez-vous demain pour une nouvelle énigme.
            </AlertDescription>
          </Alert>
          <PuzzlePageHowTo />
          <p className="mt-6 text-center">
            <Link to="/archives" className="type-link-subtle">
              <span>Voir les archives</span>
              <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </main>
    ))
    .match("wrong", ({ puzzle }) => (
      <PuzzleForm
        puzzle={puzzle}
        guess={guess}
        setGuess={setGuess}
        onSubmit={onSubmit}
        submitMutation={submitMutation}
        variant="wrong"
      />
    ))
    .match("form", ({ puzzle }) => (
      <PuzzleForm
        puzzle={puzzle}
        guess={guess}
        setGuess={setGuess}
        onSubmit={onSubmit}
        submitMutation={submitMutation}
        variant="form"
      />
    ))
    .exhaustive();
}

function PuzzleForm({
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
    <main className="page-atmosphere mx-auto w-full max-w-4xl">
      <div className="content-panel mx-auto max-w-lg">
        <p className="type-overline mb-2 text-center">Aujourd'hui</p>
        <p className="mb-8 text-center">
          <span className="type-date-hero glass-date-pill cursor-default">
            {formatDisplayDate(puzzle.date)}
          </span>
        </p>
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
                if (variant === "wrong") submitMutation.reset();
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
                Impossible de valider pour le moment. Réessaie plus tard.
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
        <PuzzlePageHowTo />
        <p className="mt-6 text-center">
          <Link to="/archives" className="type-link-subtle">
            <span>Voir les archives</span>
            <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
