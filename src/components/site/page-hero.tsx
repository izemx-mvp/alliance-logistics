import type { ReactNode } from "react";
import { CrossroadsMotif } from "./motif";
import { cn } from "@/lib/utils";

/** Shared hero band for interior pages. */
export function PageHero({
  label,
  title,
  intro,
  children,
  className,
}: {
  label: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-secondary", className)}>
      <CrossroadsMotif className="absolute -right-20 -top-20 h-80 w-80 motif-faint" />
      <CrossroadsMotif className="absolute -bottom-28 left-1/3 h-64 w-64 motif-faint opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-40 sm:px-6 lg:px-8">
        <p className="label-caps text-primary">{label}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}
