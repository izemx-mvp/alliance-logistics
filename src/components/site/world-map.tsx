import { WORLD_MAP_PATH } from "./world-map-path";

/* Casablanca + partner-hub coordinates in the 1000×500 projected viewBox. */
const CITIES: { name: string; x: number; y: number }[] = [
  { name: "New York", x: 294.4, y: 128.1 },
  { name: "São Paulo", x: 370.5, y: 306.6 },
  { name: "Dakar", x: 451.6, y: 200.3 },
  { name: "Rotterdam", x: 512.4, y: 97 },
  { name: "Dubaï", x: 653.5, y: 171.2 },
  { name: "Singapour", x: 788.4, y: 237.4 },
  { name: "Shanghai", x: 837.4, y: 154.4 },
];

const CASABLANCA = { x: 478.9, y: 147.9 };

function arcTo(x: number, y: number): string {
  const mx = (CASABLANCA.x + x) / 2;
  const my = (CASABLANCA.y + y) / 2;
  const dx = x - CASABLANCA.x;
  const dy = y - CASABLANCA.y;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = Math.min(0.28 * dist, 90);
  const cx = mx - (dy / dist) * lift;
  const cy = my + (dx / dist) * lift;
  return `M ${CASABLANCA.x} ${CASABLANCA.y} Q ${cx} ${cy} ${x} ${y}`;
}

/**
 * Stylized world map with thin red dashed route arcs departing from Casablanca.
 */
export function WorldMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 500" aria-hidden="true" className={className}>
      <path d={WORLD_MAP_PATH} className="fill-grey-soft" opacity={0.55} />
      {CITIES.map((c) => (
        <path
          key={c.name}
          d={arcTo(c.x, c.y)}
          className="route-dash stroke-primary"
          fill="none"
          strokeWidth={1.6}
          opacity={0.75}
          strokeLinecap="round"
        />
      ))}
      {CITIES.map((c) => (
        <circle
          key={`dot-${c.name}`}
          cx={c.x}
          cy={c.y}
          r={3}
          className="fill-primary"
          opacity={0.8}
        />
      ))}
      {/* Casablanca hub */}
      <circle cx={CASABLANCA.x} cy={CASABLANCA.y} r={5} className="fill-primary" />
      <circle cx={CASABLANCA.x} cy={CASABLANCA.y} r={11} className="fill-primary/30" />
      <circle cx={CASABLANCA.x} cy={CASABLANCA.y} r={18} className="fill-primary/10" />
      <text
        x={CASABLANCA.x + 24}
        y={CASABLANCA.y + 26}
        className="fill-charcoal text-[13px] font-semibold"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Casablanca
      </text>
    </svg>
  );
}
