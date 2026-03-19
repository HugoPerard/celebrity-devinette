import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  getTodayPuzzlePublic,
  submitGuess as submitGuessFn,
} from '#/server/puzzle-fns'
import { PUZZLE_TIMEZONE } from '#/lib/puzzle-constants'

export const Route = createFileRoute('/')({
  loader: () => getTodayPuzzlePublic(),
  component: Home,
})

function Home() {
  const puzzle = Route.useLoaderData()
  const submitGuess = useServerFn(submitGuessFn)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'wrong'
  >('idle')
  const [error, setError] = useState<string | null>(null)

  if (!puzzle) {
    return (
      <main className="page-wrap flex min-h-[60vh] flex-col px-4 pb-12 pt-10">
        <section className="island-shell rise-in m-auto w-full max-w-lg rounded-2xl p-8 text-center">
          <h2 className="display-title mb-3 text-2xl font-bold text-[var(--sea-ink)]">
            Aucune devinette pour l’instant
          </h2>
          <p className="text-[var(--sea-ink-soft)]">
            Ajoute <code>content/puzzles/YYYY-MM-DD.json</code> et l’image sous{' '}
            <code>public/puzzles/</code>.
          </p>
        </section>
      </main>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('submitting')
    try {
      const result = await submitGuess({
        data: { date: puzzle.date, guess },
      })
      if (result.ok) {
        setStatus('success')
      } else {
        setStatus('wrong')
      }
    } catch {
      setError('Impossible de valider pour le moment. Réessaie plus tard.')
      setStatus('idle')
    }
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-10">
      <section className="island-shell rise-in relative mx-auto max-w-lg overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <p className="island-kicker mb-2 text-center">Aujourd’hui</p>
        <p className="mb-6 text-center text-sm text-[var(--sea-ink-soft)]">
          {PUZZLE_TIMEZONE} · <strong>{puzzle.date}</strong>
        </p>
        <div className="mx-auto mb-8 max-w-md overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] shadow-[0_12px_40px_rgba(30,90,72,0.12)]">
          <img
            src={puzzle.imagePath}
            alt="Indice visuel pour la devinette"
            className="h-auto w-full object-cover"
            width={400}
            height={400}
          />
        </div>
        {puzzle.hint ? (
          <p className="mb-6 text-center text-sm text-[var(--sea-ink-soft)]">
            <span className="font-semibold text-[var(--sea-ink)]">Indice :</span>{' '}
            {puzzle.hint}
          </p>
        ) : null}

        {status === 'success' ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-6 py-8 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
              Bravo — bonne réponse !
            </p>
            <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
              Reviens demain pour une nouvelle énigme.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto flex max-w-md flex-col gap-3"
          >
            <label className="text-sm font-medium text-[var(--sea-ink)]">
              Ta réponse
              <input
                type="text"
                name="guess"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value)
                  if (status === 'wrong') setStatus('idle')
                }}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-[var(--sea-ink)] shadow-inner outline-none transition focus:border-[rgba(79,184,178,0.6)] focus:ring-2 focus:ring-[rgba(79,184,178,0.25)] dark:bg-zinc-900/80"
                placeholder="Prénom et nom…"
                disabled={status === 'submitting'}
              />
            </label>
            {status === 'wrong' ? (
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Ce n’est pas ça — encore un essai ?
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={status === 'submitting' || !guess.trim()}
              className="rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.2)] px-6 py-3 text-sm font-semibold text-[var(--lagoon-deep)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[rgba(79,184,178,0.32)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? 'Vérification…' : 'Valider'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
