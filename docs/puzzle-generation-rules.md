# Génération devinette « personnalité publique connue / jeu de mots »

> Source pour les automations Cursor et `.cursor/rules/puzzle-generation.mdc`. Consulter ce fichier pour toutes les contraintes de génération. **Inventaire des devinettes déjà publiées** : `docs/devinettes-deja-publiees.md` (à lire avant toute création, à mettre à jour après chaque ajout).

## Contenu

- **Pas** de contenu haineux, diffamatoire (respecter le cadre légal / éthique du produit).
- La devinette repose sur un **jeu de mots** (nom modifié) et une **scène concrète** qui illustre ce sens ; la figure doit **évoquer clairement** la personnalité publique (voir **Ressemblance** ci-dessous), sans être une photo de presse.

## Seuil de notoriété (avant toute génération)

**Obligatoire** : avant de retenir une personnalité et d’en générer l’image, estimer le **pourcentage de notoriété** = la probabilité (sur une personne **lambda**, adulte, francophone, sans niche spécialisée) qu’elle **connaisse** la personnalité — au moins de **nom** ou **de réputation** (pas besoin d’en être fan).

- **Cible** : idéalement **≥ 50 %** (au moins **une personne sur deux** dans ce public de référence aurait entendu parler d’elle dans un contexte **grand public** : médias, sport, ciné, musique, politique, etc.).
- **Si l’estimation est &lt; 50 %** : **ne pas valider** cette idée — en choisir **une autre** (même si le jeu de mots est brillant) ou itérer sur d’autres noms.
- **Comment estimer (heuristique)** : rayonnement **médiatique récent ou durable**, présence en **tête d’affiche** ou rôle d’arbitre du débat (animateurs, politiques, sportifs phares), **traînée** dans la culture pop partagée — pas le seul ressenti personnel ni une sous-culture. En cas d’hésitation, **favoriser** une figure clairement plus reconnue.

Cette étape s’inscrit **après** le filtre « jeu de mots valide » / inventaire, et **avant** la génération d’image et la finalisation des fichiers.

## Diversité des figures

Sur une **série de devinettes** (semaine, mois), **varier les « sources »** de **personnalités publiques connues** pour éviter l’uniformité — pas seulement des « stars » au sens étroit du terme.

- **Domaines** : alterner **acteurs et actrices**, **chanteuses et chanteurs**, **journalistes** et **présentateurs / présentatrices** (télé, radio, presse), **sportives et sportifs**, **personnalités politiques** (jeu léger, non diffamatoire, même cadre légal qu’ailleurs), **figures de la pop culture** (télé, réseaux, jeux vidéo, mèmes durables), **auteurs / intellectuels** connus du grand public, etc.
- **Époques** : mélanger **générations** — figures **classiques** ou associées à une époque passée, et figures **très actuelles**.
- **Nationalités et horizons** : ne pas tout centrer sur une seule scène nationale ; inclure des personnalités **internationales** lorsque le public francophone peut raisonnablement **reconnaître** la figure ou résoudre le jeu de mots.
- **Suivi** : avant de figer une idée, lire **`docs/devinettes-deja-publiees.md`** (inventaire des devinettes déjà livrées) et **ne pas refaire** une ligne déjà présente (même personnalité + même déformation / mêmes réponses normalisées). Compléter ce fichier à chaque nouvelle publication. Recouper avec **`content/puzzles/`** pour les dates occupées et limiter aussi les **répétitions** de registre (ex. trois acteurs français d’affilée).

## Créativité : élargir les possibilités (sans perdre la cohérence)

Le format reste **personnalité publique connue + jeu de mots sur le patronyme + scène illustrée + forte ressemblance**. Dans ce cadre, **être imaginatif** : varier les angles pour éviter la routine, tout en gardant une **chaîne lisible** pour le joueur.

### Personnalités publiques connues

- Viser des **personnalités publiques connues** au sens large : **reconnues par le grand public** (médias, sport, culture, politique, etc.), pas seulement le cinéma ou la musique.
- **Élargir volontairement** les registres au fil des semaines : cinéma, séries, musique (FR / international quand le nom traverse les frontières), **journalisme**, **animation** (télé, radio), **sport**, télé, humour, réseaux, auteurs ou intellectuels « grand public », etc.
- Une figure peut être **peu photographiée** si son **nom** et un **trait visuel** (costume, silhouette, accessoire iconique, tenue de sport, plateau TV…) suffisent à l’identification — mais éviter les noms **trop obscurs** ou les niches sans ancrage culturel partagé.
- **Cohérence** : la personnalité choisie doit **porter** le jeu de mots (le patronyme offre une prise phonétique ou une déformation crédible, pas un collage forcé).

### Jeux de mots

- Le cœur du dispositif reste : **homophone ou quasi-homophone** sur le **son** du nom (voir aussi **Traductions du patronyme** plus bas).
- **Étendre le registre** tant que c’est défendable à l’oral :
  - **Quasi-homophones** et **assonances** marquées (pas seulement une syllabe rigide).
  - **Ponts** entre langues lorsque le nom ou la carrière le suggèrent (ex. jeu **sonore** sur un nom anglophone), sans retomber dans la **traduction de sens** du patronyme.
  - Patronyme rendu en **plusieurs mots** dans la réponse si le tout reste **saisissable**, vérifiable avec `normalizeGuess`, et mémorisable.
- **Imagination oui, gratuité non** : si la déformation est trop opaque ou la scène ne « colle » pas au nom modifié, **changer d’idée**.

### Filtre de validation (une seule devinette = une lecture)

Vérifier mentalement : *« Je reconnais la figure ; le nom modifié sonne comme un calembour ; la scène illustre ce sens — les trois se renforcent. »* Si l’un des maillons casse, **revenir à une variante plus simple** plutôt qu’empiler les trouvailles.

## Fichiers à produire (par jour)

1. **JSON** : `content/puzzles/YYYY-MM-DD.json` avec les champs :
   - `date` : même chaîne que le nom de fichier.
   - `imagePath` : URL statique commençant par `/puzzles/` (fichier sous `public/puzzles/`).
   - `answersNormalized` : tableau des versions **avec le jeu de mot** (prénom + nom modifié), normalisées comme `normalizeGuess` dans `src/lib/normalize-guess.ts` (minuscules, sans accents, espaces simples ; ex. `["edouard bear"]` pour Édouard Baer, `["pierre riche"]` pour Pierre Richard, `["dany boue"]` pour Dany Boon, `["vincent dindon"]` pour Vincent Lindon, `["johnny holiday"]` pour Johnny Hallyday, `["lionel messy"]` pour Lionel Messi → Lionel Messy). Permet d'inclure plusieurs variantes acceptées (ex. avec ou sans tiret, etc.).
   - `celebrityPublicName` (optionnel) : nom usuel de la personnalité publique (notes internes / PR, pas affiché par l’app — le nom du champ reste technique).

2. **Image** : `public/puzzles/YYYY-MM-DD.png` ou `.webp` / `.jpg` (raster uniquement — **pas de SVG**), **400×400 pixels**, **contenu en plein cadre** (l’illustration remplit tout le carré, **sans bordure**, sans marge décorative, sans bandes letterbox/pillarbox) — référencée par `imagePath`.

## Sources, références et fichiers intermédiaires (hors dépôt)

**À ne pas conserver ni versionner** après une devinette livrée :

- **Fichiers source / brouillons** : exports IA ou retouches **avant** l’export final 400×400 (ex. `assets/YYYY-MM-DD-source.png`, PNG haute définition, variantes intermédiaires). Utiliser un chemin **temporaire** ou `assets/` uniquement le temps du flux ; **supprimer** ces fichiers une fois `public/puzzles/YYYY-MM-DD.*` validé.
- **Photos ou visuels de référence** : s’ils sont téléchargés ou copiés pour ancrer la génération, **ne pas les ajouter au dépôt** ; ne pas constituer de dossier « références » versionné pour les personnalités.
- **Listes d’URLs, captures, moodboards** : **ne pas** enregistrer dans le repo des fichiers dont le seul rôle est de documenter les sources visuelles utilisées pour produire l’image.

**Seuls livrables git** pour une journée : le **JSON** `content/puzzles/`, l’**image finale** sous `public/puzzles/`, et la ligne correspondante dans `docs/devinettes-deja-publiees.md` si applicable. Avant commit : vérifier qu’aucun fichier de source ou de référence n’est inclus.

## Génération d'image

### Format

- **Dimensions** : **exactement 400×400** pixels (carré) dans le dépôt (`public/puzzles/`).
- **Plein cadre** : le dessin / la scène occupe **tout le carré** jusqu’aux bords — **pas de cadre**, **pas de passe-partout**, **pas de bandes** (noir ou autre) autour du sujet, **pas d’ombre portée « carte postale »** qui réduit la zone utile.

### Export final 400×400 (obligatoire — toutes les images)

Après toute génération ou retouche (IA, export outil, etc.), **toujours** produire le fichier livré via **échelle uniforme + recadrage centré** (« object-fit: cover »), **jamais** en étirant un rectangle vers un carré.

1. **Commande du dépôt** (recommandé) : `pnpm puzzle:export -- <fichier_source> public/puzzles/YYYY-MM-DD.png`  
   - Nécessite **ImageMagick** (`magick` dans le PATH, ex. `brew install imagemagick` sur macOS).  
   - Le script applique par défaut **`-fuzz 15% -trim`** pour retirer les **bandes** letterbox/pillarbox uniformes, puis le **cover** 400×400. Désactiver le trim : `PUZZLE_EXPORT_TRIM_FUZZ=` (vide).
2. **Équivalent manuel** : `magick in.png -fuzz 15% -trim +repage -resize 400x400^ -gravity center -extent 400x400 out.png`  
   - Le `^` signifie : couvrir au moins 400×400 à ratio constant, puis `-extent` rogne le surplus au centre.
3. **Interdit** pour passer d’un rectangle au carré 400×400 : `sips -z 400 400` (ou tout outil qui **déforme** l’image pour remplir le carré).

Le prompt peut demander un visuel large ou carré ; **l’étape d’export** est la même à chaque fois. Variable optionnelle : `PUZZLE_EXPORT_SIZE` (défaut `400`) si le script doit cibler une autre taille — l’app attend **400×400** (`PUZZLE_IMAGE_SIZE`).

### Principe du jeu de mot

Le jeu de mot repose sur une **modification du nom de famille** de la **personnalité publique** pour produire un homophone ou quasi-homophone avec un sens différent (ex. : Michel Sardou → Michel Sardine, Pierre Richard → Pierre Riche, Dany Boon → Dany Boue, Vincent Lindon → Vincent Dindon, Johnny Hallyday → Johnny Holiday, Lionel Messi → Lionel Messy).

**Traductions du patronyme (à éviter)** : ne pas se contenter de **traduire le sens** du nom (souvent anglais) vers un **mot français** — ce n’est pas le même mécanisme qu’un **homophone / quasi-homophone** sur la **prononciation** du nom tel qu’on l’entend. Le joueur francophone doit pouvoir partir du **son** du patronyme, pas d’une équivalence lexicale *pit* → *fosse*, *stone* → *pierres*.

**Découpage « mot à mot » sans déformation phonétique (à éviter)** : ne pas se contenter de **recoller des mots français** qui **répètent le même son** que le patronyme **sans le transformer** en un autre mot ou quasi-homophone distinct. Si la « réponse » est seulement le patronyme **éclaté en syllabes** (ex. *Dupont* → *du pont*, même prononciation globale), le **nom de famille n’est pas modifié** au sens du jeu — **hors format**. Même logique que pour **Dujardin** → *du jardin* : le son du nom reste celui du nom d’origine, ce n’est pas une **déformation créative** du type *Lindon* → *dindon*, *Plaza* → *pizza*.

**Resegmentations « article / préposition + mot » (à éviter)** : quand le patronyme, lu ou prononcé à la française, **tombe exactement** sur une **suite déjà française** (article + substantif, etc.) **sans** que le **lexème patronymique** ne devienne un **autre mot distinct** par déformation — **hors format**. Ce n’est pas « le nom se transforme en X », c’est « on **découpe** le nom pour entendre des mots du dictionnaire ». Ex. **Alexandra Lamy → Alexandra la mie** : *Lamy* [lami] s’entend comme *la mie* ; la chaîne sonore globale reste celle du nom de famille alignée sur des morceaux de français, **pas** une **mutation** du type *Lindon* → *dindon* ou *Foresti* → *forêt si* (où le patronyme devient une autre unité lexicale reconnaissable). À classer avec *Dupont* / *Dujardin*, pas avec les bons calembours.

**Homophonie sans mutation du patronyme (à éviter)** : la réponse doit **transformer** le patronyme en **un autre mot (ou quasi-mot) nettement distinct** à l'oreille *ou* par déformation syllabique claire du type *Lindon* → *dindon*, *Cruz* → *croute*, *Plaza* → *pizza*, *Huppert* → *hyper*. **Hors format** : une « réponse » où le nom de famille **se prononce comme** le patronyme d'origine et ne change **qu'à l'écriture** en repérant un mot français **homophone** (doublet orthographique sans chute nouvelle). Ex. **Chris Rock → Chris Roc** : en français, *Rock* et *roc* se prononcent pareil [ʁɔk] — **aucune mutation phonétique** du patronyme, seulement une graphie française du même son ; ce n'est **pas** du même ordre que *Messi* → *Messy* (autre lexème, sens « désordre ») ou *Huppert* → *hyper* (autre mot français, voyelles différentes). *Test oral* : prononcer à voix haute le **nom de famille seul** dans la réponse ; s'il est **indiscernable** du patronyme réel (même suite de phonèmes), **rejeter** l'idée.

**Quasi-homonyme « collage » sans chute (à éviter, souvent patronymes non français)** : choisir un mot français **uniquement** parce qu’il **rapproche** phonétiquement un patronyme **sans** que la **forme obtenue** (prénom + mot) constitue une **expression**, une **image mentale stable** ou un **renommage plaisant** que le joueur peut **reformuler** (« on a dit X à la place du nom, et ça veut dire / évoque Y »). Si la réponse **ne veut rien dire** en français au-delà du rapprochement forcé — **hors format**. Ex. **Chris Pratt → Chris prête** : *Pratt* [pʁat] vs *prête* [pʁɛt] reste un **pont faible** ; surtout **« Chris prête »** n’est **pas** une locution ni une chute partageable (contrairement à *Michel Sardine*, *Johnny Holiday*, *Stéphane Pizza*). *Test utile* : si tu ne peux pas compléter naturellement « la blague, c’est qu’on entend … à la place du nom, et du coup … », l’idée est probablement trop creuse.

**Bon exemple (homophone, pas traduction)** : **Céline Dion → Céline d’ion** — jeu sur le **son** *Dion* / *d’ion*, pas sur le sens d’un mot à traduire.

**À éviter :**

- Scène purement littérale sans modification du nom (ex. : Tom Cruise sur un bateau de croisière)
- Calembour visuel sans transformation du patronyme
- **Antoine Dupont → Antoine du pont** : *Dupont* prononcé comme *du pont* — **pas de modification phonétique du patronyme**, simple découpage — **hors format** (à mettre au même titre que les exemples ci-dessous).
- **Jean Dujardin → Jean du jardin** : *Dujardin* = *du jardin* au son — **hors format** (même problème : le patronyme n’est pas déformé en un autre mot).
- **Will Smith → Will Forgeron** : jeu sur le **sens** du mot anglais *smith* (forgeron) avec une « réponse » en français, sans **déformation homophone** du patronyme comme dans les bons exemples (le nom *Smith* ne devient pas un autre mot sonore en français) — **hors format**.
- **Brad Pitt → Brad Fosse** : **traduction** du sens anglais *pit* (« fosse ») — **hors format** (pas d’homophone sur *Pitt* tel qu’on le prononce).
- **Emma Stone → Emma Pierres** : **traduction** du sens anglais *stone* (« pierres ») — **hors format** (même problème).
- **Alexandra Lamy → Alexandra la mie** : **resegmentation** du patronyme en *la + mie* — **pas** une déformation du nom en **un autre mot** ; même famille que *Dupont* / *Dujardin* (voir § *Resegmentations « article / préposition + mot »*).
- **Chris Pratt → Chris prête** : **collage quasi-homonyme** sur patronyme anglophone **sans chute** : « Chris prête » **n’établit pas** une expression ou une image stable ; le joueur n’a pas de **renommage** ludique clair — **hors format** (voir § *Quasi-homonyme « collage » sans chute*).
- **Chris Rock → Chris Roc** : **homophonie sans mutation** — *Rock* / *roc* même prononciation ; pas une déformation du patronyme au sens du produit — **hors format** (voir § *Homophonie sans mutation du patronyme*).

### Aucun texte

L'image ne doit **jamais** contenir de texte qui donne la réponse : pas de mots, lettres, bulles, légendes, labels lisibles. Seul le visuel permet de deviner.

### Illustration claire

La scène illustre le **sens du nom modifié** (ex. : Michel Sardine → entouré de sardines, Dany Boue → personnage dans la boue, Vincent Dindon → entouré de dindons, Johnny Holiday → en vacances à la plage, Lionel Messy → scène de désordre / bazar). Privilégier des concepts **concrets et facilement illustrables** — éviter les abstractions (longueur, neuf, etc.).

### Ressemblance avec la personnalité publique (priorité)

Le joueur doit pouvoir **reconnaître qui est évoqué** avant même de trouver le jeu de mots : le visage et le style comptent autant que la scène.

**Stratégie (idéal vs repli)** : **Idéalement**, intégrer **directement** la personnalité sur le plan visuel : **photo de référence** (portrait public, cliché iconique, image dont les droits permettent l’usage en amont du flux) ou **génération ancrée sur le visage** (image-to-image, contrôle d’identité / sujet, tout mode où le rendu part d’une **base reconnaissable** de la personne). Ces références servent **uniquement** au flux de création : **ne pas les conserver dans le dépôt** (voir § *Sources, références et fichiers intermédiaires*). L’objectif est que la structure du visage et les traits marquants soient fidèles au modèle, tout en restant dans un **rendu illustré** (semi-réaliste, peinture digitale) — pas une photo de presse ni un trompe-l’œil type deepfake. **À défaut** de référence ou de chaîne « visage », ou pour **compléter** un prompt texte, il faut **obligatoirement** recenser les **traits physiques caractéristiques** ci-dessous pour atteindre une **ressemblance suffisante** et éviter une figure générique.

1. **Recherche courte (obligatoire si pas d’ancrage visage, ou en complément)** : avant d’écrire le prompt, lister **au moins 6 critères physiques distinctifs** (pas des synonymes du même trait), publics et vérifiables — par ex. : **âge apparent** ; **forme du visage** ; **coupe, couleur et texture des cheveux** ; **barbe / moustache / rasage** ; **forme et densité des sourcils** ; **couleur et forme des yeux** ; **nez / pommettes** ; **teint** ; **silhouette ou carrure** ; **lunettes ou absence récurrente** ; **dents / sourire** ; **rides ou fossettes marquantes** ; **accessoire physique récurrent** (boucles d’oreilles, casquette, etc.). Varier les catégories pour couvrir tête, regard et corpulence.
2. **Contextualisation (obligatoire)** : ajouter dans le prompt un bloc **contexte** qui aide le joueur à **cibler la personnalité** sans donner la réponse textuelle : **métier ou registre public** (sport de haut niveau, plateau TV, cinéma, musique, politique…), **type de tenue ou accessoire de scène** cohérent avec sa notoriété (maillot, costume d’époque, micro de terrain, instrument…), et **ambiance de décor** (stade, studio, nature, scène de concert…) **sans texte lisible** sur panneaux ou écrans.
3. **Visage au centre** : cadrage **buste ou portrait** en priorité ; le personnage occupe une **part dominante du cadre** (éviter les tout-petits personnages perdus dans un décor).
4. **Traits distinctifs explicites dans le prompt** : intégrer **nommément** les **6 critères physiques minimum** et le **contexte** (pas seulement « acteur français » ou « femme élégante »).
5. **Cohérence d’époque / look** : si la personnalité a un **look reconnaissable** (époque cinéma, coupe signature, barbe caractéristique, tenue de plateau, maillot ou équipement sportif iconique…), l’aligner pour renforcer la ressemblance.
6. **Équilibre** : illustration **stylisée** (peinture digitale, pas une photo de presse ni un rendu « deepfake »), mais **charge de ressemblance élevée** — caricature expressive plutôt que figure générique.

### Qualité visuelle

Composition soignée, cadrage cinématographique, éclairage cohérent, style adapté au personnage. Éviter l'esthétique trop « IA » (visages lisses interchangeables, mains bizarres).

### Style visuel (à reproduire)

**Semi-réaliste** : entre cartoon et photo-réalisme.

- Éclairage réaliste, proportions naturelles, texture de peau
- Traits **stylisés** (rendu peinture digitale), pas une photographie — mais **traits d’identité** exagérés ou cadrés pour **maximiser la reconnaissance** (comme une couverture magazine ou une affiche de film peinte)
- Touches de peinture visibles, brushwork soigné
- **Non** : silhouette anonyme, « personnalité lambda » sans détails visibles au visage ou au corps

### Prompt type

```
Portrait ou buste : [prénom utilisé pour le jeu de mots] — PHYSIQUE (6 critères minimum, distincts) : [1], [2], [3], [4], [5], [6] (voir personnalité réelle). CONTEXTE (aide à la détection, sans texte) : [métier / registre], [tenue ou accessoire iconique], [ambiance lieu]. SCÈNE JEU DE MOTS : [situation / accessoires illustrant le nom modifié]. [Ambiance lumière]. Style semi-réaliste : peinture digitale de portrait, caricature expressive pour maximiser la reconnaissance, pas une photographie ni un photoréalisme de studio.
CRITIQUE : AUCUN texte — pas de mots, lettres, bulles, légendes, étiquettes lisibles. Visuel pur uniquement. Composition lisible en cadrage serré ; le livrable final passera par l’export 400×400 « cover » (voir § Export final) — pas besoin que le fichier brut soit déjà carré.
```

## Fuseau horaire

- La date `YYYY-MM-DD` correspond au calendrier **Europe/Paris** (voir `src/lib/puzzle-constants.ts`).

## Qualité

- Vérifier que `pnpm build` passe après ajout des fichiers.
- Ne **jamais** ajouter `answersNormalized` dans un fichier « public » séparé : il reste dans le JSON côté repo ; l'app ne l'envoie pas au client via le loader (validation via `submitGuess` uniquement).
- **Ne pas committer** sources HD, brouillons ni fichiers de référence téléchargés : § *Sources, références et fichiers intermédiaires*.
