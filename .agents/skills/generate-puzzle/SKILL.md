# Skill: Générer une devinette (Puzzle Generation)

Ce skill guide l'agent étape par étape pour créer une nouvelle devinette de haute qualité, en évitant les erreurs courantes (comme les traductions littérales) et en assurant une bonne ressemblance visuelle.

## Déclencheur
Utilise ce skill quand l'utilisateur demande de "générer une devinette", "créer un puzzle", "ajouter des jours", ou "trouver un jeu de mots".

## Étapes d'exécution

### 1. Analyse du contexte
- Lis TOUJOURS le fichier `docs/puzzle-generation-rules.md` pour te rafraîchir la mémoire sur les règles exactes.
- Liste les fichiers dans `content/puzzles/` et lis quelques JSON récents pour savoir quelles personnalités ont déjà été utilisées et quelles dates sont disponibles.

### 2. Idéation (Brainstorming)
- Propose 3 à 5 idées de personnalités publiques connues (acteurs, sportifs, journalistes, animateurs, chanteurs, politiques, etc.).
- **Règle d'or du jeu de mots** : Il doit reposer sur le **SON** (homophone ou quasi-homophone) du nom de famille en français.
- **INTERDIT** : Ne traduis JAMAIS le sens d'un nom anglais en français (ex: Brad Pitt -> Brad Fosse est INTERDIT).
- Pour chaque idée, décris brièvement la scène visuelle et la réponse attendue.
- Présente ces idées à l'utilisateur et **attends sa validation** avant de générer l'image (sauf si l'utilisateur t'a donné carte blanche totale).

### 3. Génération de l'image
- Utilise l'outil `GenerateImage`.
- **Prompt strict** : `Portrait ou buste : [Prénom] — RESSEMBLANCE : [Trait 1], [Trait 2], [Trait 3], [Trait 4] (voir personnalité réelle). [Scène illustrant le jeu de mots]. Style semi-réaliste : peinture digitale de portrait, éclairage réaliste, traits reconnaissables et intentionnellement proches du modèle public, pas une photographie ni un photoréalisme de studio. CRITIQUE : AUCUN texte — pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Composition carrée, visage dominant.`
- Sauvegarde l'image source dans `assets/YYYY-MM-DD-source.png` (ou chemin équivalent dans le workspace).

### 4. Export et formatage
- Exécute le script d'export : `pnpm puzzle:export -- <fichier_source.png> public/puzzles/YYYY-MM-DD.png`
- Vérifie que l'image fait bien 400x400 avec `magick identify`.
- Crée le fichier `content/puzzles/YYYY-MM-DD.json` avec :
  - `date`: "YYYY-MM-DD"
  - `imagePath`: "/puzzles/YYYY-MM-DD.png"
  - `answerNormalized`: Le jeu de mots normalisé (minuscules, sans accents, espaces simples).
  - `celebrityPublicName`: Le vrai nom de la personnalité.

### 5. Vérification
- Lance `pnpm build && pnpm test` pour t'assurer que tout compile et que le JSON est valide.
- Confirme à l'utilisateur que tout est prêt.
