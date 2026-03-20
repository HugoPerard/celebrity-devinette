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
- Loader : données publiques uniquement (`date`, `imagePath`).

## Suite possible

- [ ] GitHub Action cron + API image (hors MVP)
- [ ] Hébergement (Vercel / Cloudflare)

## Devinette du jour — 2026-03-20

- [x] Confirmer la date du jour au fuseau Europe/Paris
- [x] Choisir une célébrité française avec un jeu de mots de patronyme illustrable
- [x] Générer une image raster 400x400 sans texte dans `public/puzzles/2026-03-20.png`
- [x] Créer `content/puzzles/2026-03-20.json` avec les champs conformes
- [x] Vérifier localement avec `pnpm build`
- [x] Committer, pousser la branche de travail et ouvrir une PR si nécessaire

## Review — 2026-03-20

- [x] Image conforme aux règles (400x400, raster, aucun texte)
- [x] JSON conforme (`date`, `imagePath`, `answerNormalized`, `celebrityPublicName`)
- [x] Build validé
- [x] Git synchronisé
