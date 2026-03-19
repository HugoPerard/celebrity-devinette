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

## Puzzle quotidien 2026-03-19

- [x] Choisir une célébrité française et un jeu de mots visuel clair sur le nom de famille
- [x] Générer une image raster 400x400 sans texte dans `public/puzzles/2026-03-19.*`
- [x] Créer `content/puzzles/2026-03-19.json` avec réponse normalisée
- [x] Exécuter `pnpm build` et corriger si nécessaire
- [x] Committer et pousser les changements sur la branche de travail

## Review — puzzle 2026-03-19

- [x] Date Europe/Paris vérifiée (`2026-03-19`)
- [x] Fichiers puzzle et image présents (`content/puzzles/2026-03-19.json`, `public/puzzles/2026-03-19.png`)
- [x] Build validé (`pnpm install && pnpm build`)
