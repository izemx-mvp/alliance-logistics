import type { ReactNode } from "react";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { CrossroadsMotif } from "./motif";
import { SiteImage } from "./site-image";

/**
 * Interior page hero.
 * - `image`: full-bleed photo with a dark-to-transparent gradient on the text side.
 * - `texture`: container-texture background under a charcoal ~80% overlay.
 * - neither: light #F4F4F5 band (legal pages).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  texture = false,
  crumbs,
  children,
  className,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: ImageKey;
  texture?: boolean;
  crumbs?: Crumb[];
  children?: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  const dark = Boolean(image) || texture;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "bg-charcoal text-white" : "bg-secondary",
        className,
      )}
    >
      {image && (
        <>
          <SiteImage image={image} priority className="absolute inset-0 -z-20 h-full w-full" />
          {/* readable text side: dark → transparent */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-charcoal/60 to-transparent"
          />
        </>
      )}
      {texture && <TextureBackground priority />}
      <CrossroadsMotif
        className={cn(
          "absolute -right-24 -top-24 -z-10 h-96 w-96",
          dark ? "text-white/[0.06]" : "motif-faint",
        )}
      />
      <CrossroadsMotif
        className={cn(
          "absolute -bottom-32 left-1/3 -z-10 h-72 w-72",
          dark ? "text-white/[0.04]" : "motif-faint opacity-60",
        )}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-24 lg:pt-44">
        <div className={cn("hero-in", !aside && "lg:col-span-2")}>
          {crumbs && <Breadcrumbs items={crumbs} dark={dark} className="mb-6" />}
          <p className={cn("eyebrow", dark ? "text-white/75" : "text-primary")}>{eyebrow}</p>
          <h1
            className={cn(
              "mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-balance sm:text-5xl lg:text-6xl",
              dark ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h1>
          <span aria-hidden="true" className="mt-6 block h-1 w-16 rounded-full bg-primary" />
          {intro && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-relaxed",
                dark ? "text-white/85" : "text-muted-foreground",
              )}
            >
              {intro}
            </p>
          )}
          {children}
        </div>
        {aside && <div className="self-end">{aside}</div>}
      </div>
    </section>
  );
}

/** Container-texture photo under a charcoal (#2B2B2B ≈ 80%) overlay for AA text contrast. */
export function TextureBackground({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <SiteImage
        image="bgContainerTexture"
        decorative
        priority={priority}
        className={cn("absolute inset-0 -z-20 h-full w-full", className)}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/80" />
    </>
  );
}
