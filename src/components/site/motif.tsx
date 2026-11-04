import { cn } from "@/lib/utils";

/**
 * Abstract echo of the logo mark: four rounded "crossroads" arms.
 * Used as a faint decorative background motif. Color comes from currentColor
 * (apply `motif-faint` or a text color utility).
 */
export function CrossroadsMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      fill="none"
    >
      <g transform="rotate(45 100 100)">
        <rect x="44" y="18" width="26" height="72" rx="13" fill="currentColor" />
        <rect x="44" y="110" width="26" height="72" rx="13" fill="currentColor" />
        <rect x="130" y="18" width="26" height="72" rx="13" fill="currentColor" />
        <rect x="130" y="110" width="26" height="72" rx="13" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Marks sample/placeholder copy that must be replaced before launch.
 */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-grey px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        className
      )}
    >
      Contenu exemple à remplacer
    </span>
  );
}
