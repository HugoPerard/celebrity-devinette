# Instructions pour l’automation Cursor (devinette quotidienne)

Copie ce prompt dans la configuration de ton automation Cursor (cursor.com/automations).

---

## Prompt à coller dans l’automation

```
Tu dois générer et intégrer la devinette du jour dans ce repo. Lis d'abord docs/puzzle-generation-rules.md et docs/automation-daily-puzzle.md.

1) DATE
- Calcule la date du jour au fuseau Europe/Paris (YYYY-MM-DD).

2) GÉNÉRATION D'IMAGE
- Choisis une personnalité publique (prénom + nom) avec un jeu de mots sur le nom de famille (homophone ou quasi-homophone avec un sens illustrable : ex. Michel Sardou → Michel Sardine, Lionel Messi → Lionel Messy). **Varie les « sources »** par rapport aux derniers fichiers dans content/puzzles/ : ne pas enchaîner le même type (ex. uniquement des acteurs français) ; alterner domaines (cinéma, musique, politique en jeu léger, sport, pop culture, etc.), époques et nationalités lorsque le jeu reste soluble pour un public francophone — voir docs/puzzle-generation-rules.md § « Diversité des figures ».
- Avant le prompt image : liste au moins 4 traits visuels publics de la **personnalité publique connue** (visage, cheveux, barbe, expression, accessoire iconique, tenue de plateau, équipement sportif, etc.) ; portrait ou buste prioritaire ; intègre ces traits nommément dans le prompt (voir docs/puzzle-generation-rules.md section « Ressemblance »).
- Génère une image illustrant la scène du nom modifié, avec forte ressemblance stylisée (peinture digitale, pas photo). Le ratio importe peu en sortie brute.
- L'image NE DOIT contenir AUCUN texte (pas de mots, lettres, bulles, légendes).
- **Export obligatoire** : produire le fichier livré avec `pnpm puzzle:export -- <fichier_source_temporaire> public/puzzles/YYYY-MM-DD.png` (ImageMagick requis — voir docs/puzzle-generation-rules.md § Export final). Ne jamais utiliser `sips -z 400 400` sur une image non carrée (déforme). Le résultat doit être **400×400**, plein cadre, sans étirement.
- Prompt type : suivre le bloc dans docs/puzzle-generation-rules.md (RESSEMBLANCE + situation + CRITIQUE aucun texte).

3) FICHIER JSON
- Crée content/puzzles/YYYY-MM-DD.json avec :
  - date : "YYYY-MM-DD"
  - imagePath : "/puzzles/YYYY-MM-DD.png" (ou .webp/.jpg selon le fichier)
  - answersNormalized : tableau des versions avec le jeu de mot (prénom + nom modifié), normalisées en minuscules sans accents (ex. ["edouard bear"] pour Édouard Baer, ["pierre riche"] pour Pierre Richard, ["lionel messy"] pour Lionel Messi → Lionel Messy). Même logique que src/lib/normalize-guess.ts.
  - celebrityPublicName (optionnel) : nom affiché pour la PR

4) VÉRIFICATION
- Exécute pnpm build. Si ça échoue, corrige les erreurs.

5) COMMIT ET PUSH
- git add content/puzzles/YYYY-MM-DD.json public/puzzles/YYYY-MM-DD.*
- git commit -m "puzzle: add YYYY-MM-DD"
- git push origin main

Si tu n'as pas les droits de push direct sur main, ouvre une PR à la place (branch puzzle/YYYY-MM-DD) en utilisant l'outil "Open pull request".
```

---

## Prérequis côté automation

| Élément | Détail |
|--------|--------|
| **Trigger** | Scheduled (cron quotidien, ex. `0 8 * * *` pour 8h Paris) |
| **Outils** | Open pull request (si pas de push direct), ou accès Git en écriture |
| **Génération d’image** | Activer un MCP serveur d’image (ex. Gemini ImageGen) si l’agent n’a pas de génération native |
| **Export 400×400** | ImageMagick (`magick` dans le PATH) pour `pnpm puzzle:export` — voir `docs/puzzle-generation-rules.md` § Export final |

---

## Rappels depuis les règles

- **Diversité** — alterner types de **personnalités publiques connues** et horizons sur la série de puzzles (voir § *Diversité des figures* dans `docs/puzzle-generation-rules.md`).
- **Pas de SVG** — raster uniquement (.png, .webp, .jpg).
- **answersNormalized** : tableau des versions avec le jeu de mot (nom modifié). Ex. `"Édouard Bear"` (pour Baer) → `["edouard bear"]`.
- **Pas de texte dans l’image** — le jeu repose uniquement sur le visuel.
- **Export carré** — toujours `pnpm puzzle:export` (ou équivalent ImageMagick) ; jamais redimensionnement qui étire un rectangle en carré.
