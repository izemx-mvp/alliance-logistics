import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import type { Service } from "@/data/services";
import { postText, type Post } from "@/data/posts";
import { intlLocale, useLang, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { CornerBrackets } from "./motif";
import { HoverLift } from "./reveal";
import { ServiceIcon } from "./service-icon";
import { SiteImage } from "./site-image";
import { formatDate } from "./tracking-timeline";

/** Service card: hover lift + red underline drawing in + icon motion + corner brackets. */
export function ServiceCard({
  service,
  headingLevel = "h3",
  withImage = false,
  cta,
}: {
  service: Service;
  headingLevel?: "h2" | "h3";
  withImage?: boolean;
  cta?: string;
}) {
  const Heading = headingLevel;
  return (
    <HoverLift>
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgba(43,43,43,0.35)]"
      >
        {withImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <SiteImage
              image={service.image}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent"
            />
          </div>
        )}
        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
          <CornerBrackets size="sm" className="absolute inset-3" />
          <ServiceIcon
            icon={service.icon}
            className="size-12 text-charcoal transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[-4deg] motion-reduce:transform-none"
          />
          <Heading className="mt-5 font-display text-lg font-semibold leading-snug text-foreground">
            <span className="underline-draw">{service.title}</span>
          </Heading>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
            {cta}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none"
            />
          </span>
        </div>
      </Link>
    </HoverLift>
  );
}

export function PostCard({
  post,
  priority = false,
  className,
}: {
  post: Post;
  priority?: boolean;
  className?: string;
}) {
  const lang = useLang();
  const t = useT();
  const text = postText(post, lang);
  return (
    <HoverLift className={className}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          <SiteImage
            image={post.image}
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-charcoal">
            {t.news.categories[post.category]}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date, intlLocale(lang))}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3.5" />{" "}
              {t.common.minutes(post.readingMinutes)}
            </span>
          </p>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
            <Link
              to="/actualites/$slug"
              params={{ slug: post.slug }}
              className="before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none focus-visible:before:rounded-2xl focus-visible:before:ring-2 focus-visible:before:ring-primary"
            >
              <span className="underline-draw">{text.title}</span>
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {text.excerpt}
          </p>
          <span
            aria-hidden="true"
            className={cn(
              "mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary",
            )}
          >
            {t.common.readArticle}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none" />
          </span>
        </div>
      </article>
    </HoverLift>
  );
}
