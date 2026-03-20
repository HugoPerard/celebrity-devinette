import type * as React from "react";
import { cn } from "@/lib/utils";
import { PUZZLE_IMAGE_SIZES } from "@/lib/puzzle-image";

type PuzzleImageProps = {
  src: string;
  alt: string;
  /** Use `high` for the LCP candidate (main puzzle on home). */
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  className?: string;
} & Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "sizes" | "decoding"
>;

export function PuzzleImage({
  className,
  fetchPriority = "auto",
  loading = "eager",
  src,
  alt,
  ...props
}: PuzzleImageProps): React.ReactElement {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      sizes={PUZZLE_IMAGE_SIZES}
      decoding="async"
      fetchPriority={fetchPriority}
      loading={loading}
      className={cn("block", className)}
    />
  );
}
