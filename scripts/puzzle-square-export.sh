#!/usr/bin/env bash
# Export canonique : carré 400×400 sans déformation (échelle uniforme + crop centré).
# Ne pas utiliser `sips -z 400 400` sur une source non carrée (étire les pixels).
# Par défaut : retire les bandes letterbox/pillarbox uniformes (même couleur que les bords),
# puis « cover » — désactiver avec PUZZLE_EXPORT_TRIM_FUZZ vide.
set -euo pipefail

SIZE="${PUZZLE_EXPORT_SIZE:-400}"
TRIM_FUZZ="${PUZZLE_EXPORT_TRIM_FUZZ:-15%}"

usage() {
  echo "Usage: $0 <fichier_source> <fichier_sortie_400x400>"
  echo "  (ou: pnpm puzzle:export -- <source> <sortie>)"
  echo "Requires: ImageMagick \`magick\` in PATH (e.g. brew install imagemagick)"
  echo "Optional: PUZZLE_EXPORT_SIZE=512 (default ${SIZE}); PUZZLE_EXPORT_TRIM_FUZZ=15% (empty = no -trim)."
  exit 1
}

# pnpm run puzzle:export -- a b forwards "--" as first arg
[[ "${1:-}" == "--" ]] && shift
[[ $# -eq 2 ]] || usage
[[ -f "$1" ]] || { echo "Not a file: $1" >&2; exit 1; }

if ! command -v magick &>/dev/null; then
  echo "Missing ImageMagick: install so \`magick\` is in PATH (e.g. brew install imagemagick)" >&2
  exit 1
fi

trim_args=()
if [[ -n "${TRIM_FUZZ}" ]]; then
  trim_args=(-fuzz "${TRIM_FUZZ}" -trim +repage)
fi

magick "$1" "${trim_args[@]}" -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" "$2"
echo "Wrote ${SIZE}×${SIZE}: $2"
