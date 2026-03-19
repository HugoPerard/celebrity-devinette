# Kasistar

Application [TanStack Start](https://tanstack.com/start) : chaque jour, une **image-indice** (jeu de mots / célébrité) à deviner. Les énigmes sont des fichiers dans le dépôt (`content/puzzles/` + `public/puzzles/`). Les automations Cursor peuvent ouvrir une PR quotidienne en suivant `docs/automation-daily-puzzle.md`.

## Fuseau horaire

Le jour de jeu suit le calendrier **Europe/Paris** (`src/lib/puzzle-constants.ts`).

## Démarrage

```bash
pnpm install
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
pnpm preview
```

## Structure utile

| Chemin | Rôle |
|--------|------|
| `content/puzzles/YYYY-MM-DD.json` | Métadonnées + `answerNormalized` (validation serveur) |
| `public/puzzles/` | Images raster servies en statique (`.png`, `.webp`, `.jpg` — pas de SVG) |
| `src/server/puzzle-fns.ts` | `getTodayPuzzlePublic`, `submitGuess` |
| `docs/automation-daily-puzzle.md` | Checklist publication quotidienne |

## Tests

```bash
pnpm test
```

## Puzzles d’exemple

Fichiers `2026-03-19` et `2025-03-19` dans `content/puzzles/` (la page d’accueil affiche la devinette résolue pour la date du jour à Paris, ou la plus récente disponible).

Réponses pour tester : `jean dujardin` / `marion cotillard`.

## Déploiement

Voir la [doc hosting TanStack Start](https://tanstack.com/start/latest/docs/framework/react/guide/hosting.md).
