import { motion, useReducedMotion } from "framer-motion";
import { project } from "@/data/network";
import { cn } from "@/lib/utils";
import { WORLD_MAP_PATH } from "./world-map-path";

export type MapPoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  active?: boolean;
  /** Hide this point's label even when labels are shown. */
  hideLabel?: boolean;
};

export type MapView = { x: number; y: number; w: number; h: number };
const FULL_VIEW: MapView = { x: 0, y: 0, w: 1000, h: 500 };

const CASABLANCA = project(33.57, -7.59);

/** Default partner hubs for decorative maps (hero, home teaser). */
export const DEFAULT_HUBS: MapPoint[] = [
  { id: "nyc", name: "New York", ...project(40.71, -74.0) },
  { id: "sao", name: "Santos", ...project(-23.96, -46.33) },
  { id: "dkr", name: "Dakar", ...project(14.69, -17.44) },
  { id: "rtm", name: "Rotterdam", ...project(51.92, 4.48) },
  { id: "dxb", name: "Dubaï", ...project(25.2, 55.27) },
  { id: "sin", name: "Singapour", ...project(1.29, 103.85) },
  { id: "sha", name: "Shanghai", ...project(31.23, 121.47) },
];

export function arcFromCasablanca(x: number, y: number): string {
  const mx = (CASABLANCA.x + x) / 2;
  const my = (CASABLANCA.y + y) / 2;
  const dx = x - CASABLANCA.x;
  const dy = y - CASABLANCA.y;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = Math.min(0.3 * dist, 110);
  // Always bend the arc "upward" (towards the north) for a consistent look.
  const sign = dx >= 0 ? 1 : -1;
  const cx = mx + sign * (dy / dist) * lift;
  const cy = my - sign * (dx / dist) * lift;
  return `M ${CASABLANCA.x} ${CASABLANCA.y} Q ${cx} ${cy} ${x} ${y}`;
}

/**
 * Stylized world map with red route arcs drawn from Casablanca.
 * Arcs draw in once (Framer Motion), then a small "shipment" dot travels each route.
 * Reduced motion: arcs are shown statically, no travelling dots.
 */
export function WorldMap({
  className,
  points = DEFAULT_HUBS,
  tone = "light",
  showLabels = false,
  title,
  view = FULL_VIEW,
  onPointClick,
}: {
  className?: string;
  points?: MapPoint[];
  tone?: "light" | "dark";
  showLabels?: boolean;
  /** Accessible title; without it the map is decorative. */
  title?: string;
  /** Visible region (map units, 1000×500). Changing it animates a zoom. */
  view?: MapView;
  onPointClick?: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const land = tone === "dark" ? "fill-white/[0.16]" : "fill-grey-soft";
  const label = tone === "dark" ? "fill-white" : "fill-charcoal";
  // Keep markers, strokes and labels the same on-screen size whatever the zoom.
  const k = FULL_VIEW.w / view.w;
  const vb = `${view.x} ${view.y} ${view.w} ${view.h}`;

  return (
    <motion.svg
      viewBox={vb}
      initial={false}
      animate={{ viewBox: vb }}
      transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-auto w-full overflow-hidden", className)}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <path d={WORLD_MAP_PATH} className={land} opacity={tone === "dark" ? 1 : 0.6} />
      {points.map((p, i) => {
        const d = arcFromCasablanca(p.x, p.y);
        const dim = p.active === false;
        return (
          <g key={p.id} opacity={dim ? 0.18 : 1} style={{ transition: "opacity 300ms" }}>
            <motion.path
              d={d}
              fill="none"
              className="stroke-primary"
              strokeWidth={(tone === "dark" ? 2.2 : 1.6) / k}
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            {!reduced && !dim && (
              <circle r={3 / k} className="fill-primary">
                <animateMotion
                  dur={`${5 + (i % 3)}s`}
                  begin={`${1.6 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            )}
            {onPointClick && (
              <circle
                cx={p.x}
                cy={p.y}
                r={12 / k}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => onPointClick(p.id)}
              />
            )}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={(dim ? 2.5 : 3.5) / k}
              className="pointer-events-none fill-primary"
              initial={reduced ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.12 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            {showLabels && !dim && !p.hideLabel && (
              <text
                x={p.x + 7 / k}
                y={p.y - 6 / k}
                className={cn(label, "pointer-events-none font-medium")}
                style={{ fontFamily: "var(--font-sans)", fontSize: 11 / k }}
              >
                {p.name}
              </text>
            )}
          </g>
        );
      })}
      {/* Casablanca hub */}
      <circle cx={CASABLANCA.x} cy={CASABLANCA.y} r={18 / k} className="fill-primary/15" />
      {!reduced && (
        <circle
          cx={CASABLANCA.x}
          cy={CASABLANCA.y}
          r={8 / k}
          className="fill-none stroke-primary"
          strokeWidth={1.5 / k}
        >
          <animate attributeName="r" values={`${6 / k};${22 / k}`} dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={CASABLANCA.x} cy={CASABLANCA.y} r={5.5 / k} className="fill-primary" />
      <text
        x={CASABLANCA.x - 14 / k}
        y={CASABLANCA.y + 30 / k}
        className={cn(label, "font-semibold")}
        style={{ fontFamily: "var(--font-sans)", fontSize: 13 / k }}
        textAnchor="end"
      >
        Casablanca
      </text>
    </motion.svg>
  );
}