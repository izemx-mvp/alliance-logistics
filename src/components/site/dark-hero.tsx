import type { ReactNode } from "react";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { CrossroadsMotif } from "./motif";
import { TextureBackground } from "./page-hero";
import { SiteImage } from "./site-image";

/**
 * Dark interior hero shared by the redesigned pages: slow Ken Burns photo
 * (or the container texture), large display title and an optional right column.
 * `overlap` leaves room at the bottom for a card pulled up over the hero.
 */
export function DarkHero({
  eyebrow,
  title,
  text,
  crumbs,
  image,
  aside,
  children,
  overlap = false,
  className,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  crumbs: Crumb[];
  image?: ImageKey;
  aside?: ReactNode;
  children?: ReactNode;
  overlap?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-charcoal text-white", className)}>
      {image ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
            <div className="animate-kenburns h-full w-full">
              <SiteImage image={image} priority decorative sizes="100vw" className="h-full w-full" />
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/30" />
        </>
      ) : (
        <TextureBackground priority />
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      <CrossroadsMotif className="absolute -left-24 bottom-0 -z-10 h-[26rem] w-[26rem] text-white/[0.05]" />
      <CrossroadsMotif className="absolute -right-20 -top-20 -z-10 h-80 w-80 text-white/[0.04]" />

      <div
        className={cn(
          "mx-auto grid max-w-7xl items-end gap-10 px-4 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44",
          aside && "lg:grid-cols-[1.2fr_0.8fr]",
          overlap ? "pb-36 lg:pb-44" : "pb-20 lg:pb-24",
        )}
      >
        <div className="hero-in">
          <Breadcrumbs items={crumbs} dark className="mb-6" />
          <p className="eyebrow text-white/80">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.04] text-balance sm:text-6xl xl:text-7xl">
            {title}
          </h1>
          {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{text}</p>}
          {children}
        </div>
        {aside && <div className="hero-in">{aside}</div>}
      </div>
    </section>
  );
}