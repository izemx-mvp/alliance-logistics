import { useT } from "@/i18n";
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
      focusable="false"
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
 * Corner brackets framing a card or an image (logo-inspired detail).
 * The parent must be `relative`. Brackets turn red on parent `group` hover.
 */
export function CornerBrackets({
  className,
  tone = "grey",
  size = "md",
}: {
  className?: string;
  tone?: "grey" | "red" | "light";
  size?: "sm" | "md";
}) {
  const color =
    tone === "red"
      ? "border-primary"
      : tone === "light"
        ? "border-white/50 group-hover:border-primary"
        : "border-grey-soft group-hover:border-primary";
  const s = size === "sm" ? "size-3" : "size-5";
  const base = cn("pointer-events-none absolute transition-colors duration-300", s, color);
  return (
    <span aria-hidden="true" className={cn("pointer-events-none", className)}>
      <span className={cn(base, "left-0 top-0 border-l-2 border-t-2")} />
      <span className={cn(base, "right-0 top-0 border-r-2 border-t-2")} />
      <span className={cn(base, "bottom-0 left-0 border-b-2 border-l-2")} />
      <span className={cn(base, "bottom-0 right-0 border-b-2 border-r-2")} />
    </span>
  );
}

/** Marks sample/placeholder copy that must be replaced before launch. */
export function SampleTag({ className }: { className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-grey px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {t.common.sample}
    </span>
  );
}