# Devinette célébrités — suivi

## Implémentation initiale

- [x] Scaffold TanStack Start (`celebrity-devinette`)
- [x] Modèle puzzle (Zod, `content/` + `public/`, Europe/Paris)
- [x] Page unique `/` + `submitGuess` sans fuite réponse dans le loader
- [x] Règles Cursor + `docs/automation-daily-puzzle.md`
- [x] Repo GitHub + README

## Review

- Build : `pnpm build` OK.
- Tests : `pnpm test` (normalizeGuess).
- Client bundle : pas de chaînes `answerNormalized` / réponses dans `dist/client`.
- Loader : données publiques uniquement (`date`, `imagePath`, `hint`).

## Suite possible

- [ ] GitHub Action cron + API image (hors MVP)
- [ ] Hébergement (Vercel / Cloudflare)
