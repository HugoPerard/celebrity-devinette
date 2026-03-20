"use client";

import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  "Récupération de l'énigme du jour…",
  "Chargement de l'image-indice…",
  "Synchronisation sur l'heure de Paris…",
] as const;

/** Messages pour l'écran de chargement des archives */
export const ARCHIVES_LOADING_MESSAGES = [
  "Chargement de l'énigme sélectionnée…",
  "Mise à jour du calendrier…",
  "Récupération de l'image-indice…",
] as const;

export function LoadingPuzzleHint({
  messages = DEFAULT_MESSAGES,
}: {
  messages?: readonly string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % messages.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="status"
      aria-live="polite"
      aria-relevant="text"
    >
      <p className="flex min-h-12 items-center justify-center text-center text-sm text-muted-foreground motion-safe:transition-opacity motion-safe:duration-300">
        {messages[index]}
      </p>
      <div className="flex gap-1" aria-hidden>
        {messages.map((_, i) => (
          <span
            key={i}
            className={
              i === index
                ? "size-1.5 rounded-full bg-primary/70 motion-safe:animate-pulse"
                : "size-1.5 rounded-full bg-muted-foreground/25"
            }
          />
        ))}
      </div>
    </div>
  );
}
