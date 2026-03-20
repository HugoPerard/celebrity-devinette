# Génération devinette « célébrité / jeu de mots »

> Source pour les automations Cursor et `.cursor/rules/puzzle-generation.mdc`. Consulter ce fichier pour toutes les contraintes de génération.

## Contenu

- **Pas** de contenu haineux, diffamatoire (respecter le cadre légal / éthique du produit).
- La devinette repose sur un **jeu de mots** (nom modifié) et une **scène concrète** qui illustre ce sens ; la figure doit **évoquer clairement** la personnalité publique (voir **Ressemblance** ci-dessous), sans être une photo de presse.

## Diversité des figures

Sur une **série de devinettes** (semaine, mois), **varier les « sources »** de célébrités pour éviter l’uniformité :

- **Domaines** : alterner **acteurs et actrices**, **chanteuses et chanteurs**, **personnalités politiques** (jeu léger, non diffamatoire, même cadre légal qu’ailleurs), **sportifs**, **figures de la pop culture** (télé, réseaux, jeux vidéo, mèmes durables), **auteurs / intellectuels** connus du grand public, etc.
- **Époques** : mélanger **générations** — figures **classiques** ou associées à une époque passée, et figures **très actuelles**.
- **Nationalités et horizons** : ne pas tout centrer sur une seule scène nationale ; inclure des personnalités **internationales** lorsque le public francophone peut raisonnablement **reconnaître** la figure ou résoudre le jeu de mots.
- **Suivi** : avant de figer une idée, **parcourir les puzzles récents** dans `content/puzzles/` pour limiter les **répétitions** du même type (ex. trois acteurs français d’affilée) ou du même registre.

## Fichiers à produire (par jour)

1. **JSON** : `content/puzzles/YYYY-MM-DD.json` avec les champs :
   - `date` : même chaîne que le nom de fichier.
   - `imagePath` : URL statique commençant par `/puzzles/` (fichier sous `public/puzzles/`).
   - `answerNormalized` : version **avec le jeu de mot** (prénom + nom modifié), normalisée comme `normalizeGuess` dans `src/lib/normalize-guess.ts` (minuscules, sans accents, espaces simples ; ex. `edouard bear` pour Édouard Baer, `pierre riche` pour Pierre Richard, `dany boue` pour Dany Boon, `vincent dindon` pour Vincent Lindon, `johnny holiday` pour Johnny Hallyday).
   - `celebrityPublicName` (optionnel) : pour notes internes / PR, pas affiché par l'app.

2. **Image** : `public/puzzles/YYYY-MM-DD.png` ou `.webp` / `.jpg` (raster uniquement — **pas de SVG**), **400×400 pixels**, **contenu en plein cadre** (l’illustration remplit tout le carré, **sans bordure**, sans marge décorative, sans bandes letterbox/pillarbox) — référencée par `imagePath`.

## Génération d'image

### Format

- **Dimensions** : **exactement 400×400** pixels (carré).
- **Plein cadre** : le dessin / la scène occupe **tout le carré** jusqu’aux bords — **pas de cadre**, **pas de passe-partout**, **pas de bandes** (noir ou autre) autour du sujet, **pas d’ombre portée « carte postale »** qui réduit la zone utile. Si l’image générée n’est pas carrée ou comporte des marges, **recadrer ou redimensionner** pour obtenir un fichier **400×400** à contenu maximal.

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

### Ressemblance avec la célébrité (priorité)

Le joueur doit pouvoir **reconnaître qui est évoqué** avant même de trouver le jeu de mots : le visage et le style comptent autant que la scène.

1. **Recherche courte (obligatoire)** : avant d’écrire le prompt, lister **au moins 4 éléments** visuels publics et vérifiables (ex. : forme du visage, coupe / couleur de cheveux, barbe ou moustache, sourcils, rides ou fossettes marquantes, teint, silhouette, âge apparent, lunettes ou bijoux récurrents, tenue ou accessoire iconique).
2. **Visage au centre** : cadrage **buste ou portrait** en priorité ; le personnage occupe une **part dominante du cadre** (éviter les tout-petits personnages perdus dans un décor).
3. **Traits distinctifs explicites dans le prompt** : intégrer **nommément** plusieurs de ces éléments (pas seulement « acteur français » ou « femme élégante »).
4. **Cohérence d’époque / look** : si la célébrité a un **look reconnaissable** (époque cinéma, coupe signature, barbe caractéristique), l’aligner pour renforcer la ressemblance.
5. **Équilibre** : illustration **stylisée** (peinture digitale, pas une photo de presse ni un rendu « deepfake »), mais **charge de ressemblance élevée** — caricature expressive plutôt que figure générique.

### Qualité visuelle

Composition soignée, cadrage cinématographique, éclairage cohérent, style adapté au personnage. Éviter l'esthétique trop « IA » (visages lisses interchangeables, mains bizarres).

### Style visuel (à reproduire)

**Semi-réaliste** : entre cartoon et photo-réalisme.

- Éclairage réaliste, proportions naturelles, texture de peau
- Traits **stylisés** (rendu peinture digitale), pas une photographie — mais **traits d’identité** exagérés ou cadrés pour **maximiser la reconnaissance** (comme une couverture magazine ou une affiche de film peinte)
- Touches de peinture visibles, brushwork soigné
- **Non** : silhouette anonyme, « acteur lambda » sans détails biographiques visibles au visage

### Prompt type

```
Portrait ou buste : [prénom utilisé pour le jeu de mots] — RESSEMBLANCE : [trait 1], [trait 2], [trait 3], [trait 4] (voir célébrité réelle). [Situation / accessoires illustrant le nom modifié]. [Ambiance, éclairage]. Style semi-réaliste : peinture digitale de portrait, éclairage réaliste, traits reconnaissables et intentionnellement proches du modèle public, pas une photographie ni un photoréalisme de studio.
CRITIQUE : AUCUN texte — pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Carré 400x400 plein cadre — illustration edge-to-edge, sans bordure ni bandes.
```

## Fuseau horaire

- La date `YYYY-MM-DD` correspond au calendrier **Europe/Paris** (voir `src/lib/puzzle-constants.ts`).

## Qualité

- Vérifier que `pnpm build` passe après ajout des fichiers.
- Ne **jamais** ajouter `answerNormalized` dans un fichier « public » séparé : il reste dans le JSON côté repo ; l'app ne l'envoie pas au client via le loader (validation via `submitGuess` uniquement).
