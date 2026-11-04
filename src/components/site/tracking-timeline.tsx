import { Check } from "lucide-react";
import { trackingSteps, type Shipment } from "@/data/shipments";
import { cn } from "@/lib/utils";

/**
 * Vertical status timeline used on /suivi and the home page teaser.
 */
export function TrackingTimeline({
  shipment,
  className,
}: {
  shipment: Shipment;
  className?: string;
}) {
  return (
    <ol className={cn("space-y-0", className)}>
      {trackingSteps.map((label, i) => {
        const done = i < shipment.statusIndex;
        const current = i === shipment.statusIndex;
        const future = i > shipment.statusIndex;
        const event = shipment.events.find((e) => e.label.startsWith(label));
        return (
          <li key={label} className="relative flex gap-4 pb-7 last:pb-0">
            {/* connector */}
            {i < trackingSteps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  done ? "bg-primary/60" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary bg-background",
                future && "border-border bg-background"
              )}
            >
              {done && <Check className="size-3.5" aria-hidden="true" />}
              {current && <span className="size-2.5 rounded-full bg-primary" />}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  future && "text-muted-foreground",
                  current && "text-foreground",
                  done && "text-foreground"
                )}
              >
                {label}
                {current && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    En cours
                  </span>
                )}
              </p>
              {(event || done || current) && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {event?.date ?? "—"}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
