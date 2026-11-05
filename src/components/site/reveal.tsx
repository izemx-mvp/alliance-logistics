import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Tag = "div" | "section" | "li" | "span" | "ul" | "ol" | "article";

/** Fade + rise on scroll into view, once. Respects prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
  as?: Tag;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Parent of staggered children (<StaggerItem>). Animates once when in view. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  as?: Tag;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  as?: Tag;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}

/** Count-up figure that animates when scrolled into view. */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 1.6,
  locale = "fr-FR",
}: {
  value: number;
  suffix?: string | undefined;
  prefix?: string | undefined;
  className?: string | undefined;
  duration?: number;
  locale?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  // Render the final value on the server so the figure is meaningful without JS.
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || started.current) return;
    if (!inView) {
      setDisplay(0);
      return;
    }
    started.current = true;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{display.toLocaleString(locale)}</span>
      {suffix}
    </span>
  );
}

/** Card wrapper with a subtle hover lift (disabled when reduced motion). */
export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn("h-full", className)}
      {...(reduced ? {} : { whileHover: { y: -6 } })}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
