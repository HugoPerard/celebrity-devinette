# Automation : publier la devinette du jour

Ce dépôt est pensé pour une **PR quotidienne** (Cursor, script local, ou humain) qui ajoute l’énigme du jour.

## Prérequis

- Date du jour au fuseau **Europe/Paris** (`YYYY-MM-DD`).
- Image prête (générée par IA ou autre) au format convenu.

## Checklist

1. **Créer l’image**
   - **Diversité** : parcourir les puzzles récents dans `content/puzzles/` et choisir une figure qui **varie** les domaines, époques et horizons (acteurs, musique, politique en jeu léger, sport, pop culture, international, etc.) — voir `docs/puzzle-generation-rules.md` § *Diversité des figures*.
   - Chemin : `public/puzzles/YYYY-MM-DD.png` ou `.webp` / `.jpg` (**pas de SVG**).
   - **400×400** exact, **plein cadre** (pas de bordure ni bandes) — voir `docs/puzzle-generation-rules.md` § *Format*.
   - Taille raisonnable (éviter fichiers énormes dans Git).
   - **Ressemblance** : suivre la section dédiée dans `docs/puzzle-generation-rules.md` (traits nommés, portrait/buste, prompt avec `RESSEMBLANCE`).

2. **Créer le JSON**
   - Chemin : `content/puzzles/YYYY-MM-DD.json`.
   - Remplir `date`, `imagePath` (ex. `/puzzles/YYYY-MM-DD.webp`), `answerNormalized` (voir `docs/puzzle-generation-rules.md`).
   - Contrôler que `answerNormalized` === résultat de la même normalisation que l’utilisateur taperait (prénom + nom, etc.).

3. **Valider localement**

   ```bash
   pnpm install
   pnpm build
   pnpm dev
   ```

   - Ouvrir `/` : l’image et l’indice s’affichent.
   - Tester une **mauvaise** puis une **bonne** réponse.

4. **Commit & PR**

   ```bash
   git checkout -b puzzle/YYYY-MM-DD
   git add content/puzzles/YYYY-MM-DD.json public/puzzles/YYYY-MM-DD.<png|webp|jpg>
   git commit -m "puzzle: add YYYY-MM-DD"
   git push -u origin puzzle/YYYY-MM-DD
   ```

5. **Merge** avant minuit Paris si tu veux que la devinette soit « celle du jour » le jour J (sinon la logique choisit la dernière énigme disponible ≤ aujourd’hui).

## Cursor

- **Règles** : Lire `docs/puzzle-generation-rules.md` pour toutes les contraintes (contenu, formats, JSON, image).
- **IDE** : La règle `.cursor/rules/puzzle-generation.mdc` applique ces règles quand tu travailles sur les puzzles.
- **Automations** : Prompts prêts à copier dans `docs/automation-prompt.md`.

## Notes

- La réponse attendue est dans le JSON versionné : ce n’est **pas** un secret vis-à-vis de quelqu’un qui lit le dépôt ; l’app évite seulement de l’exposer dans le HTML/loader côté joueur occasionnel.
- Pour un vrai secret, il faudrait stockage serveur chiffré ou génération à la volée (hors scope MVP).
