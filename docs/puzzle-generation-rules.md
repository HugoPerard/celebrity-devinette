# Génération devinette « célébrité / jeu de mots »

> Source pour les automations Cursor et `.cursor/rules/puzzle-generation.mdc`. Consulter ce fichier pour toutes les contraintes de génération.

## Contenu

- **Pas** de contenu haineux, diffamatoire (respecter le cadre légal / éthique du produit).
- La devinette doit être un **jeu de mots** ou indice visuel **abstrait**.

## Fichiers à produire (par jour)

1. **JSON** : `content/puzzles/YYYY-MM-DD.json` avec les champs :
   - `date` : même chaîne que le nom de fichier.
   - `imagePath` : URL statique commençant par `/puzzles/` (fichier sous `public/puzzles/`).
   - `answerNormalized` : version **avec le jeu de mot** (prénom + nom modifié), normalisée comme `normalizeGuess` dans `src/lib/normalize-guess.ts` (minuscules, sans accents, espaces simples ; ex. `edouard bear` pour Édouard Baer, `pierre riche` pour Pierre Richard, `dany boue` pour Dany Boon, `vincent dindon` pour Vincent Lindon, `johnny holiday` pour Johnny Hallyday).
   - `celebrityPublicName` (optionnel) : pour notes internes / PR, pas affiché par l'app.

2. **Image** : `public/puzzles/YYYY-MM-DD.png` ou `.webp` / `.jpg` (raster uniquement — **pas de SVG**), **format 400×400 pixels**, référencée par `imagePath`.

## Génération d'image

### Format

- **Dimensions** : **400×400** pixels.

### Principe du jeu de mot

Le jeu de mot repose sur une **modification du nom de famille** de la célébrité pour produire un homophone ou quasi-homophone avec un sens différent (ex. : Michel Sardou → Michel Sardine, Pierre Richard → Pierre Riche, Dany Boon → Dany Boue, Vincent Lindon → Vincent Dindon, Johnny Hallyday → Johnny Holiday).

**À éviter :**

- Scène purement littérale sans modification du nom (ex. : Tom Cruise sur un bateau de croisière)
- Calembour visuel sans transformation du patronyme
- Décomposition du nom en mots existants sans vrai jeu de mot (ex. : Jean Dujardin dans un jardin — « du jardin » = sens littéral du patronyme, pas d’homophone créatif)

### Aucun texte

L'image ne doit **jamais** contenir de texte qui donne la réponse : pas de mots, lettres, bulles, légendes, labels lisibles. Seul le visuel permet de deviner.

### Illustration claire

La scène illustre le **sens du nom modifié** (ex. : Michel Sardine → entouré de sardines, Dany Boue → personnage dans la boue, Vincent Dindon → entouré de dindons, Johnny Holiday → en vacances à la plage). Privilégier des concepts **concrets et facilement illustrables** — éviter les abstractions (longueur, neuf, etc.).

### Qualité visuelle

Composition soignée, cadrage cinématographique, éclairage cohérent, style adapté au personnage. Éviter l'esthétique trop « IA ».

### Style visuel (à reproduire)

**Semi-réaliste** : entre cartoon et photo-réalisme.

- Éclairage réaliste, proportions naturelles, texture de peau
- Traits **stylisés** (features assouplies, rendu peinture digitale), pas une photographie
- Touches de peinture visibles, brushwork soigné
- Le personnage conserve des **traits distinctifs** reconnaissables (accessoires, silhouette, expression) pour permettre la devinette, sans être une copie photo

### Prompt type

```
[Description de la célébrité avec traits distinctifs] [situation illustrant le nom modifié] [ambiance, éclairage]. Style semi-réaliste : peinture digitale, éclairage réaliste, traits stylisés et assouplis, pas de photographie.
CRITIQUE : L'image ne doit contenir AUCUN texte - pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Format 400x400.
```

## Fuseau horaire

- La date `YYYY-MM-DD` correspond au calendrier **Europe/Paris** (voir `src/lib/puzzle-constants.ts`).

## Qualité

- Vérifier que `pnpm build` passe après ajout des fichiers.
- Ne **jamais** ajouter `answerNormalized` dans un fichier « public » séparé : il reste dans le JSON côté repo ; l'app ne l'envoie pas au client via le loader (validation via `submitGuess` uniquement).
