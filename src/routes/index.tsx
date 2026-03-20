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
      <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-4 pb-16 pt-12 sm:pt-14">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </main>
    ))
    .match("error", () => (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col px-4 pb-16 pt-12 sm:pt-14">
        <div className="m-auto w-full max-w-lg text-center">
          <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
            Erreur de chargement
          </h2>
          <p className="text-sm text-muted-foreground">
            Impossible de charger la devinette. Réessaie plus tard.
          </p>
          <Link
            to="/archives"
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Voir les archives
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    ))
    .match("no-puzzle", () => (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col px-4 pb-16 pt-12 sm:pt-14">
        <div className="m-auto w-full max-w-lg text-center">
          <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
            Aucune devinette pour l'instant
          </h2>
          <p className="text-sm text-muted-foreground">
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
          <Link
            to="/archives"
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Voir les archives
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    ))
    .match("success", ({ puzzle }) => (
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-12 sm:pt-14">
        <div className="mx-auto max-w-lg">
          <p className="mb-1 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Aujourd'hui
          </p>
          <p className="mb-8 text-center text-sm text-muted-foreground">
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
              loading="eager"
            />
          </div>
          <Alert variant="success" className="mb-8">
            <CircleCheckIcon aria-hidden className="size-4 shrink-0" />
            <AlertTitle>Bravo — bonne réponse !</AlertTitle>
            <AlertDescription>
              Reviens demain pour une nouvelle énigme.
            </AlertDescription>
          </Alert>
          <p className="mt-10 text-center">
            <Link
              to="/archives"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
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
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-12 sm:pt-14">
      <div className="mx-auto max-w-lg">
        <p className="mb-1 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Aujourd'hui
        </p>
        <p className="mb-8 text-center text-sm text-muted-foreground">
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
            loading="eager"
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
                Ce n'est pas ça — encore un essai ?
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
            {submitMutation.isPending ? "Vérification…" : "Valider"}
          </Button>
        </form>
        <p className="mt-10 text-center">
          <Link
            to="/archives"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Voir les archives</span>
            <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
