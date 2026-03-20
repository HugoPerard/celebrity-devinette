# Instructions pour l’automation Cursor (devinette quotidienne)

Copie ce prompt dans la configuration de ton automation Cursor (cursor.com/automations).

---

## Prompt à coller dans l’automation

```
Tu dois générer et intégrer la devinette du jour dans ce repo. Lis d'abord docs/puzzle-generation-rules.md et docs/automation-daily-puzzle.md.

1) DATE
- Calcule la date du jour au fuseau Europe/Paris (YYYY-MM-DD).

2) GÉNÉRATION D'IMAGE
- Choisis une célébrité française (prénom + nom) et un jeu de mots sur son nom de famille (homophone ou quasi-homophone avec un sens illustrable : ex. Michel Sardou → Michel Sardine).
- Génère une image 400×400 pixels illustrant la scène du nom modifié.
- L'image NE DOIT contenir AUCUN texte (pas de mots, lettres, bulles, légendes).
- Sauvegarde l'image dans public/puzzles/YYYY-MM-DD.png (ou .webp / .jpg).
- Prompt type pour la génération : [description célébrité] [scène illustrant le nom modifié] [ambiance]. CRITIQUE : aucune écriture visible. Format 400x400.

3) FICHIER JSON
- Crée content/puzzles/YYYY-MM-DD.json avec :
  - date : "YYYY-MM-DD"
  - imagePath : "/puzzles/YYYY-MM-DD.png" (ou .webp/.jpg selon le fichier)
  - answerNormalized : version avec le jeu de mot (prénom + nom modifié), normalisée en minuscules sans accents (ex. "edouard bear" pour Édouard Baer, "pierre riche" pour Pierre Richard). Même logique que src/lib/normalize-guess.ts.
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

---

## Rappels depuis les règles

- **Pas de SVG** — raster uniquement (.png, .webp, .jpg).
- **answerNormalized** : version avec le jeu de mot (nom modifié). Ex. `"Édouard Bear"` (pour Baer) → `"edouard bear"`.
- **Pas de texte dans l’image** — le jeu repose uniquement sur le visuel.
