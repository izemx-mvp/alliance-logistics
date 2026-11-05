import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "./reveal";

/** Numbered process, horizontal on desktop (animated connector), vertical on mobile. */
export function ProcessTimeline({
  steps,
  dark = false,
  className,
}: {
  steps: { title: string; text: string }[];
  dark?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const cols =
    steps.length >= 6 ? "lg:grid-cols-6" : steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <div className={cn("relative", className)}>
      <motion.span
        aria-hidden="true"
        className="absolute left-7 right-7 top-7 hidden h-0.5 origin-left bg-primary/40 lg:block"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <Stagger as="ol" className={cn("relative grid gap-8 sm:grid-cols-2", cols)}>
        {steps.map((step, i) => (
          <StaggerItem as="li" key={step.title} className="relative flex gap-4 lg:block">
            <div
              className={cn(
                "relative flex size-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold shadow-sm",
                dark
                  ? "border-primary bg-charcoal text-white"
                  : "border-primary/30 bg-white text-primary",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3
                className={cn(
                  "font-display text-base font-semibold lg:mt-5",
                  dark ? "text-white" : "text-foreground",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "mt-1.5 text-sm leading-relaxed",
                  dark ? "text-white/75" : "text-muted-foreground",
                )}
              >
                {step.text}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
