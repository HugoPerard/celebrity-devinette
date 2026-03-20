/** Canonical puzzle asset size — see `docs/puzzle-generation-rules.md` / `.cursor/rules/puzzle-generation.mdc` */
export const PUZZLE_IMAGE_SIZE = 400 as const;

/** For `sizes` — matches `.puzzle-frame` max width (26rem) */
export const PUZZLE_IMAGE_SIZES = "min(100vw, 26rem)" as const;
