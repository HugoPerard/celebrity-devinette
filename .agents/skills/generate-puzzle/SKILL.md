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
- **Règle d'or du jeu de mots** : le patronyme doit **muter** en **un autre mot** (lexème distinct), pas seulement se **réécrire** en français avec le **même son** qu’à l’oral (ex. **Chris Rock → Chris Roc** : *rock* / *roc* homophones — **interdit**, voir `docs/puzzle-generation-rules.md` § *Homophonie sans mutation du patronyme*). Viser des déformations du type *Lindon* → *dindon*, *Cruz* → *croute*, *Huppert* → *hyper*.
- **INTERDIT** : Ne traduis JAMAIS le sens d'un nom anglais en français (ex: Brad Pitt -> Brad Fosse est INTERDIT).
- Pour chaque idée, décris brièvement la scène visuelle et la réponse attendue.

### 2bis. Seuil de notoriété (avant de valider la génération)

- Pour **chaque** personnalité retenue au moment de figer l’idée, estimer le **pourcentage de notoriété** : probabilité qu’une **personne adulte lambda**, francophone, **sans** expertise de niche, ait **déjà entendu parler** de cette personne (nom ou visage) dans un contexte **grand public**.
- **Règle** : si l’estimation est **inférieure à 50 %**, **abandonner** ce choix et en proposer **un autre** (autre personnalité et/ou autre prise) — ne pas lancer la génération d’image tant que le seuil n’est pas atteint.
- En **dessous** de 50 %, le jeu de mots n’est **pas** une excuse : le produit vise le **partage** et la **reconnaissance** pour le plus grand nombre. Voir `docs/puzzle-generation-rules.md` § *Seuil de notoriété*.

- Présente les idées **validées** (jeu de mots + notoriété ≥ 50 %) à l’utilisateur et **attends sa validation** avant de générer l’image (sauf si l’utilisateur t’a donné **carte blanche** totale).

### 3. Génération de l'image
- Utilise l'outil `GenerateImage`.
- **Ressemblance** : **idéalement**, partir d'une **photo de référence** ou d'un flux **génération avec visage** / image-to-image lorsque l'outil le permet, pour intégrer **directement** la personnalité. **Sinon** (ou en complément), **avant le prompt** : lister **au moins 6 critères physiques distinctifs** (âge apparent, forme du visage, cheveux, barbe, yeux, sourcils, nez, teint, silhouette, etc. — pas six fois la même idée) pour une **ressemblance suffisante**, + un **bloc contexte** (métier / registre public, tenue ou accessoire de scène, ambiance de lieu). Voir `docs/puzzle-generation-rules.md` § Ressemblance et § Prompt type.
- **Prompt strict** : `Portrait ou buste : [Prénom] — PHYSIQUE (6 minimum) : [1]…[6] (voir personnalité réelle). CONTEXTE : [métier], [tenue/accessoire iconique], [lieu/ambiance]. SCÈNE JEU DE MOTS : [illustration du nom modifié]. Style semi-réaliste, caricature expressive. CRITIQUE : AUCUN texte — pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Visage dominant.`
- Fichier **brut / source** (avant export 400×400) : chemin **temporaire** ou sous `assets/` **uniquement** le temps du flux. **Ne pas** versionner les références téléchargées ni les brouillons. Détail : `docs/puzzle-generation-rules.md` § *Sources, références et fichiers intermédiaires*.

### 4. Export et formatage
- Exécute le script d'export : `pnpm puzzle:export -- <fichier_source.png> public/puzzles/YYYY-MM-DD.png`
- Vérifie que l'image fait bien 400x400 avec `magick identify`.
- **Après** export et validation : **supprimer** le fichier source intermédiaire et toute copie locale de **référence** (photos, captures) ; **ne pas** ajouter d’artefacts de sourcing au dépôt.
- Crée le fichier `content/puzzles/YYYY-MM-DD.json` avec :
  - `date`: "YYYY-MM-DD"
  - `imagePath`: "/puzzles/YYYY-MM-DD.png"
  - `answersNormalized`: Tableau des jeux de mots normalisés (minuscules, sans accents, espaces simples). Permet d'inclure plusieurs variantes.
  - `celebrityPublicName`: Le vrai nom de la personnalité.

### 5. Vérification
- Lance `pnpm build && pnpm test` pour t'assurer que tout compile et que le JSON est valide.
- Avant tout commit : `git status` — **aucun** fichier de source, brouillon ou référence ne doit être stagé (seulement `content/puzzles/`, `public/puzzles/`, `docs/devinettes-deja-publiees.md` si mis à jour).
- Confirme à l'utilisateur que tout est prêt.
