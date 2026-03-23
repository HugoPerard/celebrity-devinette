# Devinette personnalités publiques — suivi

## Implémentation initiale

- [x] Scaffold TanStack Start (`celebrity-devinette`)
- [x] Modèle puzzle (Zod, `content/` + `public/`, Europe/Paris)
- [x] Page unique `/` + `submitGuess` sans fuite réponse dans le loader
- [x] Règles Cursor + `docs/automation-daily-puzzle.md`
- [x] Repo GitHub + README

## Review

- Build : `pnpm build` OK.
- Tests : `pnpm test` (normalizeGuess).
- Client bundle : pas de chaînes `answersNormalized` / réponses dans `dist/client`.
- Loader : données publiques uniquement (`date`, `imagePath`).
- Déploiement Vercel : les JSON sous `content/puzzles/` ne sont pas sur le disque serverless ; chargement via `import.meta.glob` dans `src/server/puzzle-registry.ts` pour les embarquer au build.

## Sons feedback (soundcn)

- [x] `npx shadcn@latest add @soundcn/use-sound @soundcn/error-008 @soundcn/confirmation-003`
- [x] Accueil + archives : confirmation sur bonne réponse, erreur sur mauvaise réponse ou échec réseau

### Review

- Build + tests OK après intégration.

## Blocage devinettes futures (serveur)

- [x] `listReleasedPuzzleDates` / `isPuzzleDateReleased` (calendrier Europe/Paris)
- [x] `resolvePuzzleDateForPlay` sans fallback « dernière du repo » si tout est futur
- [x] `getPuzzleByDate`, `listAvailableDates`, `submitGuess` alignés

### Review

- `pnpm test` + `tsc --noEmit` OK.

## Suite possible

- [ ] GitHub Action cron + API image (hors MVP)
- [ ] Hébergement (Vercel / Cloudflare)

## Page Archives (mars 2026)

- [x] Date par défaut : veille (Paris), avec repli si pas de fichier ce jour-là
- [x] Layout aligné sur l’accueil : overline « Archives », date en `type-date-hero` cliquable
- [x] Modale calendrier : aperçu image par jour avec devinette + indicateur résolu (localStorage)

### Review

- `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test` OK.

## Devinette du jour 2026-03-23

- [x] Confirmer la date du jour au fuseau Europe/Paris (`2026-03-23`)
- [x] Auditer l'existant pour le slot du jour (`content/puzzles/2026-03-23.json` présent, image manquante)
- [x] Générer une image source illustrant `Léa Salamé` -> `Léa Salami` sans texte visible
- [x] Exporter le livrable en `public/puzzles/2026-03-23.png` au format exact 400x400
- [x] Vérifier/mettre à jour `content/puzzles/2026-03-23.json`
- [x] Exécuter `pnpm build`
- [x] Committer et pousser les changements sur la branche de travail

### Review

- [x] Vérification visuelle du PNG généré (pas de texte, cadrage plein cadre)
- [x] Build local OK (`pnpm install --frozen-lockfile && pnpm build`)
