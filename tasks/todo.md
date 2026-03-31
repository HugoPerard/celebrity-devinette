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

## Devinette du jour (2026-03-30)

- [x] Lire les règles de génération et l'automation du puzzle quotidien
- [x] Calculer la date du jour au fuseau Europe/Paris
- [x] Parcourir les puzzles récents pour éviter une répétition de registre
- [x] Choisir une célébrité française et formaliser un jeu de mots sonore conforme
- [x] Générer l'image source puis exporter le livrable 400x400 dans `public/puzzles/`
- [x] Créer `content/puzzles/2026-03-30.json`
- [ ] Exécuter `pnpm build`
- [ ] Committer et pousser les fichiers du puzzle du jour

### Review

- [x] Vérifier le format image (400x400, sans texte visible)
- [x] Vérifier la cohérence du JSON (`date`, `imagePath`, `answersNormalized`)
- [ ] Vérifier que `pnpm build` passe

## Devinette du jour (2026-03-31)

- [x] Lire les règles de génération et l'automation du puzzle quotidien
- [x] Calculer la date du jour au fuseau Europe/Paris
- [x] Parcourir les puzzles récents pour éviter une répétition de registre
- [x] Choisir une célébrité française et formaliser un jeu de mots sonore conforme
- [x] Générer l'image source puis exporter le livrable 400x400 dans `public/puzzles/`
- [x] Créer `content/puzzles/2026-03-31.json`
- [x] Exécuter `pnpm build`
- [x] Committer et pousser les fichiers du puzzle du jour

### Review

- [x] Vérifier le format image (400x400, sans texte visible)
- [x] Vérifier la cohérence du JSON (`date`, `imagePath`, `answersNormalized`)
- [x] Vérifier que `pnpm build` passe
