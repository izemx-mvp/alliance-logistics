import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { CrossroadsMotif } from "./motif";
import { TextureBackground } from "./page-hero";
import { Reveal } from "./reveal";

/** Conversion band used at the bottom of every page (container texture + charcoal overlay). */
export function CtaBand({
  className,
  title,
  text,
  search,
}: {
  className?: string;
  title?: string;
  text?: string;
  /** Prefill for /cotation, e.g. { service: "agence-en-douane" }. */
  search?: LinkProps<"/cotation">["search"];
}) {
  const t = useT();
  const phone = site.contact.phones[0];

  return (
    <section className={cn("relative isolate overflow-hidden bg-charcoal text-white", className)}>
      <TextureBackground />
      <CrossroadsMotif className="absolute -right-16 -top-16 -z-10 h-72 w-72 text-white/[0.06]" />
      <CrossroadsMotif className="absolute -bottom-24 -left-16 -z-10 h-64 w-64 text-white/[0.05]" />
      <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-white/70">{t.cta.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-white text-balance sm:text-4xl">
            {title ?? t.cta.title}
          </h2>
          <p className="mt-3 text-white/85">
            {text ?? (
              <>
                {t.cta.text}{" "}
                <strong className="font-semibold text-white">{t.cta.textStrong}</strong>.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/cotation" search={search ?? {}}>
              {t.cta.quote} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          {phone && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label={`${t.cta.call} ${phone}`}>
                <Phone className="size-4" aria-hidden="true" /> {phone}
              </a>
            </Button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
