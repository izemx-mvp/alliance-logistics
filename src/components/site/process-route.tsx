/**
 * ProcessRoute — scroll-drawn route with a moving container marker.
 * Shared by the homepage, /services and /services/$slug.
 * Place in: src/components/site/process-route.tsx
 */
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container as ContainerIcon } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";
import { SiteImage } from "@/components/site/site-image";
import { cn } from "@/lib/utils";

export type RouteStep = { title: string; text: string };

export function ProcessRoute({
  steps,
  eyebrow,
  title,
  text,
  footer,
  background = "texture",
  id,
}: {
  steps: RouteStep[];
  eyebrow: string;
  title: string;
  text?: string;
  footer?: ReactNode;
  background?: "texture" | "plain" | "secondary";
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const markerLeft = useTransform(progress, [0, 1], ["0%", "100%"]);
  const [activeStep, setActiveStep] = useState(reduce ? steps.length - 1 : -1);

  useMotionValueEvent(progress, "change", (v) => {
    if (reduce) return;
    setActiveStep(Math.min(steps.length - 1, Math.floor(v * steps.length + 0.15)));
  });

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id={id}
      className={cn(
        "relative isolate scroll-mt-28 overflow-hidden py-20 lg:py-32",
        background === "secondary" && "bg-secondary",
      )}
    >
      {background === "texture" && (
        <>
          <div aria-hidden="true" className="absolute inset-0 -z-20">
            <SiteImage image="bgContainerTexture" sizes="100vw" className="h-full w-full" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/[0.93]" />
        </>
      )}
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} {...(text ? { text } : {})} />

        <div ref={ref} className="relative mt-16">
          {/* rail (desktop) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-6 hidden lg:block">
            <div className="h-px w-full border-t-2 border-dashed border-border" />
            <motion.div
              style={{ scaleX: reduce ? 1 : progress }}
              className="absolute left-0 top-0 h-0.5 w-full origin-left bg-primary"
            />
            <motion.div
              style={{ left: reduce ? "100%" : markerLeft }}
              className="absolute -top-5 -translate-x-1/2"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-white shadow-[0_10px_24px_-8px_rgba(200,16,46,0.7)]">
                <ContainerIcon className="size-5" />
              </span>
            </motion.div>
          </div>

          {/* vertical rail (mobile) */}
          <div aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px bg-border lg:hidden">
            <motion.div
              style={{ scaleY: reduce ? 1 : progress }}
              className="absolute inset-0 origin-top bg-primary"
            />
          </div>

          <ol
            className="grid gap-10 lg:gap-6 lg:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
            style={{ "--steps": steps.length } as CSSProperties}
          >
            {steps.map((step, i) => {
              const done = i <= activeStep;
              return (
                <li key={step.title} className="relative flex gap-5 lg:block lg:pt-20">
                  <span
                    className={cn(
                      "relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition-all duration-500 lg:hidden",
                      done
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-muted-foreground",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "hidden font-display text-5xl font-bold leading-none transition-colors duration-500 lg:block",
                        done
                          ? "text-primary"
                          : "text-transparent [-webkit-text-stroke:1.5px_#c4c4c8]",
                      )}
                    >
                      {pad(i + 1)}
                    </p>
                    <h3 className="font-display text-lg font-semibold lg:mt-4">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {footer && <div className="mt-14">{footer}</div>}
      </Container>
    </section>
  );
}