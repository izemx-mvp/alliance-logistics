import { Check } from "lucide-react";
import { TRACKING_STEP_COUNT, type Shipment } from "@/data/shipments";
import { intlLocale, useLang, useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function formatDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Vertical status timeline used on /suivi and the home page teaser. */
export function TrackingTimeline({
  shipment,
  className,
  dark = false,
}: {
  shipment: Shipment;
  className?: string;
  dark?: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);

  return (
    <ol className={cn("space-y-0", className)}>
      {Array.from({ length: TRACKING_STEP_COUNT }, (_, i) => {
        const label = t.tracking.steps[i] ?? "";
        const done = i < shipment.statusIndex;
        const current = i === shipment.statusIndex;
        const future = i > shipment.statusIndex;
        const event = shipment.events.find((e) => e.step === i);
        return (
          <li
            key={label}
            className="relative flex gap-4 pb-7 last:pb-0"
            aria-current={current ? "step" : undefined}
          >
            {i < TRACKING_STEP_COUNT - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  done ? "bg-primary/70" : dark ? "bg-white/15" : "bg-border",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                done && "border-primary bg-primary text-primary-foreground",
                current && cn("border-primary", dark ? "bg-charcoal" : "bg-background"),
                future && (dark ? "border-white/25 bg-charcoal" : "border-border bg-background"),
              )}
            >
              {done && <Check className="size-3.5" />}
              {current && (
                <span className="size-2.5 rounded-full bg-primary motion-safe:animate-pulse" />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  future
                    ? dark
                      ? "text-white/55"
                      : "text-muted-foreground"
                    : dark
                      ? "text-white"
                      : "text-foreground",
                )}
              >
                {label}
                {current && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {t.tracking.current}
                  </span>
                )}
              </p>
              {event && (
                <p
                  className={cn("mt-0.5 text-xs", dark ? "text-white/65" : "text-muted-foreground")}
                >
                  <time dateTime={event.date}>{formatDate(event.date, locale)}</time> ·{" "}
                  {event.location}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
