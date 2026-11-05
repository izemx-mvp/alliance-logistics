import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Uppercase eyebrow + Poppins heading + optional lead, used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  dark = false,
  as: Heading = "h2",
  className,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "eyebrow",
            align === "center" && "justify-center",
            dark ? "text-white/70" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "mt-3 font-display text-3xl font-bold leading-tight text-balance sm:text-4xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </Heading>
      {text && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            align === "center" && "mx-auto",
            "max-w-2xl",
            dark ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
      {children}
    </Reveal>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}
