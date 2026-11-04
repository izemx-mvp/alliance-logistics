import type { ServiceIconKey } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Custom line-art SVG illustrations for the six services.
 * Stroke inherits currentColor; a red accent detail uses --color-primary.
 */
const icons: Record<ServiceIconKey, React.ReactNode> = {
  ship: (
    <>
      {/* containers stacked on hull */}
      <path d="M20 18h10v8H20zM32 18h10v8H32zM26 8h10v8H26z" className="stroke-primary" />
      {/* hull */}
      <path d="M8 30h48l-6 12H16L8 30Z" />
      {/* waves */}
      <path d="M10 50c5-4 9-4 14 0s9 4 14 0 9-4 14 0" />
    </>
  ),
  plane: (
    <>
      <path d="M12 34 52 26c3-.6 5 1.5 4 4l-3 7-14 2" />
      <path d="M26 39 12 34l4-8 12 2" />
      <path d="M39 15c2-3 6-3 6 0l-2 11" />
      <path d="M18 46h20" className="stroke-primary" />
    </>
  ),
  truck: (
    <>
      {/* cargo box */}
      <path d="M6 18h30v22H6z" />
      {/* cab */}
      <path d="M36 24h10l8 9v7h-18" />
      {/* wheels */}
      <circle cx="16" cy="44" r="5" />
      <circle cx="46" cy="44" r="5" />
      <path d="M21 44h20" />
      <path d="M12 26h10M12 32h10" className="stroke-primary" />
    </>
  ),
  warehouse: (
    <>
      {/* roof */}
      <path d="M6 24 32 8l26 16" />
      {/* walls */}
      <path d="M10 24v26h44V24" />
      {/* door */}
      <path d="M22 50V36h20v14" />
      {/* stacked boxes */}
      <path d="M26 42h6v8h-6zM32 36h6v6h-6z" className="stroke-primary" />
    </>
  ),
  reefer: (
    <>
      {/* container */}
      <path d="M10 16h44v30H10z" />
      <path d="M18 16v30M27 16v30M37 16v30M46 16v30" />
      {/* snowflake */}
      <g className="stroke-primary">
        <path d="M32 22v18M25 26l14 10M39 26 25 36" />
      </g>
    </>
  ),
  oversize: (
    <>
      {/* flatbed */}
      <path d="M6 40h48v6H6z" />
      {/* wheels */}
      <circle cx="16" cy="50" r="5" />
      <circle cx="44" cy="50" r="5" />
      {/* long load extending beyond bed */}
      <path d="M2 32h60" className="stroke-primary" />
      <path d="M14 32v8M50 32v8" />
      {/* warning flag */}
      <path d="M56 32V20l8 3-8 4" />
    </>
  ),
};

export function ServiceIcon({
  icon,
  className,
}: {
  icon: ServiceIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-12", className)}
    >
      {icons[icon]}
    </svg>
  );
}
