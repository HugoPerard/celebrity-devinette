# Skill: Générer une devinette (Puzzle Generation)

Ce skill guide l'agent étape par étape pour créer une nouvelle devinette de haute qualité, en évitant les erreurs courantes (comme les traductions littérales) et en assurant une bonne ressemblance visuelle.

## Déclencheur
Utilise ce skill quand l'utilisateur demande de "générer une devinette", "créer un puzzle", "ajouter des jours", ou "trouver un jeu de mots".

## Étapes d'exécution

### 1. Analyse du contexte
- Lis TOUJOURS le fichier `docs/puzzle-generation-rules.md` pour te rafraîchir la mémoire sur les règles exactes.
- Lis **obligatoirement** `docs/devinettes-deja-publiees.md` : ne **pas** reproposer une combinaison déjà listée (même personnalité + même jeu de mots / mêmes `answersNormalized`). En cas de doute, recoupe avec les JSON dans `content/puzzles/`.
- Liste les fichiers dans `content/puzzles/` pour les dates déjà prises et, si besoin, le détail des entrées non encore reflétées dans le fichier d’inventaire.

### 2. Idéation (Brainstorming)
- Propose 3 à 5 idées de personnalités publiques connues (acteurs, sportifs, journalistes, animateurs, chanteurs, politiques, etc.).
- **Règle d'or du jeu de mots** : Il doit reposer sur le **SON** (homophone ou quasi-homophone) du nom de famille en français.
- **INTERDIT** : Ne traduis JAMAIS le sens d'un nom anglais en français (ex: Brad Pitt -> Brad Fosse est INTERDIT).
- Pour chaque idée, décris brièvement la scène visuelle et la réponse attendue.
- Présente ces idées à l'utilisateur et **attends sa validation** avant de générer l'image (sauf si l'utilisateur t'a donné carte blanche totale).

### 3. Génération de l'image
- Utilise l'outil `GenerateImage`.
- **Ressemblance** : **idéalement**, partir d'une **photo de référence** ou d'un flux **génération avec visage** / image-to-image lorsque l'outil le permet, pour intégrer **directement** la personnalité. **Sinon** (ou en complément), **avant le prompt** : lister **au moins 6 critères physiques distinctifs** (âge apparent, forme du visage, cheveux, barbe, yeux, sourcils, nez, teint, silhouette, etc. — pas six fois la même idée) pour une **ressemblance suffisante**, + un **bloc contexte** (métier / registre public, tenue ou accessoire de scène, ambiance de lieu). Voir `docs/puzzle-generation-rules.md` § Ressemblance et § Prompt type.
- **Prompt strict** : `Portrait ou buste : [Prénom] — PHYSIQUE (6 minimum) : [1]…[6] (voir personnalité réelle). CONTEXTE : [métier], [tenue/accessoire iconique], [lieu/ambiance]. SCÈNE JEU DE MOTS : [illustration du nom modifié]. Style semi-réaliste, caricature expressive. CRITIQUE : AUCUN texte — pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Visage dominant.`
- Sauvegarde l'image source dans `assets/YYYY-MM-DD-source.png` (ou chemin équivalent dans le workspace).

### 4. Export et formatage
- Exécute le script d'export : `pnpm puzzle:export -- <fichier_source.png> public/puzzles/YYYY-MM-DD.png`
- Vérifie que l'image fait bien 400x400 avec `magick identify`.
- Crée le fichier `content/puzzles/YYYY-MM-DD.json` avec :
  - `date`: "YYYY-MM-DD"
  - `imagePath`: "/puzzles/YYYY-MM-DD.png"
  - `answersNormalized`: Tableau des jeux de mots normalisés (minuscules, sans accents, espaces simples). Permet d'inclure plusieurs variantes.
  - `celebrityPublicName`: Le vrai nom de la personnalité.

### 5. Vérification
- Lance `pnpm build && pnpm test` pour t'assurer que tout compile et que le JSON est valide.
- Confirme à l'utilisateur que tout est prêt.
