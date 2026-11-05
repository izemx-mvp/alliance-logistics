import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { PageHero } from "@/components/site/page-hero";
import { ProcessRoute } from "@/components/site/process-route";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { SiteImage } from "@/components/site/site-image";
import {
  getService,
  localizeService,
  services as allServices,
  type Service,
  type ServiceSlug,
} from "@/data/services";
import { getDictionary, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, faqLd, pageHead, serviceLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ match, params }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    const service = getService(params.slug, lang);
    if (!service)
      return { meta: [{ title: t.notFound.seoTitle }, { name: "robots", content: "noindex" }] };
    const path = `/services/${service.slug}`;
    return pageHead({
      lang,
      path,
      title: `${service.title} | Alliance Logistics`,
      description: service.short,
      jsonLd: [
        serviceLd({ name: service.title, description: service.intro, path, lang }),
        faqLd(service.faq),
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.services, path: "/services" },
            { name: service.title, path },
          ],
          lang,
        ),
      ],
    });
  },
  component: ServicePage,
});

const pad = (n: number) => String(n).padStart(2, "0");

const SECTION_IDS = ["prise-en-charge", "etapes", "faq", "services-lies"] as const;
type SectionId = (typeof SECTION_IDS)[number];

/* ================================================================== */
/* Sticky in-page navigation with active section                       */
/* ================================================================== */

function InPageNav({ serviceSlug }: { serviceSlug: ServiceSlug }) {
  const t = useT();
  const [active, setActive] = useState<SectionId>("prise-en-charge");

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const labels: Record<SectionId, string> = {
    "prise-en-charge": t.service.featuresEyebrow,
    etapes: t.service.stepsEyebrow,
    faq: t.service.faqEyebrow,
    "services-lies": t.service.relatedEyebrow,
  };

  return (
    <nav
      aria-label={t.service.featuresEyebrow}
      className="sticky top-16 z-30 border-b border-border bg-white/90 backdrop-blur-md lg:top-20"
    >
      <Container className="flex items-center gap-4">
        <ul className="-mb-px flex flex-1 gap-1 overflow-x-auto">
          {SECTION_IDS.map((id, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-4 text-sm font-semibold transition-colors",
                  active === id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-xs text-primary">{pad(i + 1)}</span>
                {labels[id]}
              </a>
            </li>
          ))}
        </ul>
        <Button asChild size="sm" className="hidden shrink-0 sm:inline-flex">
          <Link to="/cotation" search={{ service: serviceSlug }}>
            {t.nav.quoteShort} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </nav>
  );
}

/* ================================================================== */
/* Capabilities as a cargo manifest                                    */
/* ================================================================== */

function Manifest({ service, index }: { service: Service; index: number }) {
  const t = useT();
  return (
    <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-charcoal px-6 py-4 text-white">
        <p className="eyebrow text-white">{t.service.manifest}</p>
        <p className="font-mono text-xs tracking-widest text-white/60">
          AL-SRV-{pad(index + 1)} · {service.capabilities.length} {t.service.manifestItems}
        </p>
      </div>
      {/* perforated edge */}
      <div
        aria-hidden="true"
        className="h-2 w-full [background:radial-gradient(circle_at_6px_0,transparent_4px,#fff_4.5px)_0_0/12px_8px_repeat-x]"
      />
      <ol>
        {service.capabilities.map((cap, i) => (
          <li
            key={cap.title}
            className="group relative grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1 border-b border-dashed border-border px-6 py-6 transition-colors last:border-b-0 hover:bg-secondary md:grid-cols-[3rem_0.9fr_1.4fr] md:items-baseline"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
            />
            <span className="font-mono text-sm text-primary">{pad(i + 1)}</span>
            <h3 className="font-display text-lg font-semibold">{cap.title}</h3>
            <p className="col-start-2 text-sm leading-relaxed text-muted-foreground md:col-start-3">
              {cap.text}
            </p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/* ================================================================== */
/* Related service tile                                                */
/* ================================================================== */

function RelatedTile({ service, cta }: { service: Service; cta: string }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white outline-none ring-primary focus-visible:ring-4"
    >
      <SiteImage
        image={service.image}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="absolute inset-0 -z-20 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
      <CornerBrackets tone="light" size="sm" className="absolute inset-3 opacity-60 transition-opacity group-hover:opacity-100" />
      <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:ring-primary motion-reduce:transform-none">
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </span>
      <ServiceIcon icon={service.icon} className="size-9 text-white" />
      <h3 className="mt-3 font-display text-xl font-bold">{service.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-white/80">{service.short}</p>
      <span className="sr-only">{cta}</span>
    </Link>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

function ServicePage() {
  const base = Route.useLoaderData();
  const t = useT();
  const lang = useLang();
  const service = localizeService(base, lang);
  const index = Math.max(0, allServices.findIndex((s) => s.slug === service.slug));
  const nextBase = allServices[(index + 1) % allServices.length]!;
  const next = localizeService(nextBase, lang);
  const related = service.related
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => localizeService(s, lang));

  return (
    <>
      {/* Hero */}
      <PageHero
        image={service.image}
        eyebrow={`${pad(index + 1)} / ${pad(allServices.length)} · ${t.service.eyebrow}`}
        title={service.title}
        intro={service.intro}
        crumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services, href: "/services" },
          { label: service.title },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/cotation" search={{ service: service.slug }}>
              {t.service.quote} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <Link to="/services">{t.service.allServices}</Link>
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {service.chips.slice(0, 5).map((chip) => (
            <li
              key={chip}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm"
            >
              {chip}
            </li>
          ))}
        </ul>
      </PageHero>

      <InPageNav serviceSlug={service.slug} />

      {/* 01 — Capabilities manifest */}
      <section id="prise-en-charge" className="relative scroll-mt-36 overflow-hidden py-20 lg:py-28">
        <CrossroadsMotif className="absolute -right-32 top-20 h-96 w-96 motif-faint" />
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <span
              aria-hidden="true"
              className="block font-display text-[7rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_#c8102e] lg:text-[9rem]"
            >
              {pad(index + 1)}
            </span>
            <Reveal className="-mt-6 flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-charcoal text-white">
                <ServiceIcon icon={service.icon} className="size-8" />
              </span>
            </Reveal>
            <SectionHeading
              className="mt-6"
              eyebrow={t.service.featuresEyebrow}
              title={t.service.featuresTitle}
            />
          </div>
          <Manifest service={service} index={index} />
        </Container>
      </section>

      {/* 02 — Steps (scroll route) */}
      <ProcessRoute
        id="etapes"
        eyebrow={t.service.stepsEyebrow}
        title={t.service.stepsTitle}
        steps={service.steps}
      />

      {/* 03 — FAQ + side card */}
      <section id="faq" className="scroll-mt-36 py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <SectionHeading eyebrow={t.service.faqEyebrow} title={t.service.faqTitle} />
            <Reveal>
              <Accordion type="single" collapsible defaultValue="faq-0" className="mt-8 space-y-3">
                {service.faq.map((item, i) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${i}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-white px-6 transition-colors data-[state=open]:border-charcoal data-[state=open]:bg-secondary"
                  >
                    <AccordionTrigger className="gap-4 py-5 text-left font-display text-base font-semibold hover:no-underline [&>svg]:hidden">
                      <span className="font-mono text-sm text-primary">{pad(i + 1)}</span>
                      <span className="flex-1">{item.question}</span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                        <Plus aria-hidden="true" className="size-4" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pl-9 text-base leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>

          <Reveal className="lg:sticky lg:top-40 lg:self-start">
            <div className="relative isolate overflow-hidden rounded-3xl p-8 text-white">
              <SiteImage
                image={service.image}
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="absolute inset-0 -z-20 h-full w-full"
              />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/85" />
              <CornerBrackets tone="light" className="absolute inset-3" />
              <h2 className="eyebrow text-white/70">{t.service.chipsTitle}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/15"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/15 pt-8">
                <p className="font-display text-2xl font-semibold leading-snug">
                  {t.service.ctaTitle(service.title)}
                </p>
                <p className="mt-2 text-sm text-white/75">{t.service.ctaText}</p>
                <Button asChild className="mt-6 w-full sm:w-auto">
                  <Link to="/cotation" search={{ service: service.slug }}>
                    {t.service.quote} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 04 — Related services */}
      <section id="services-lies" className="scroll-mt-36 bg-secondary py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow={t.service.relatedEyebrow} title={t.service.relatedTitle} />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <StaggerItem key={s.slug}>
                <RelatedTile service={s} cta={t.common.discover} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Next service — full-width band */}
      <Link
        to="/services/$slug"
        params={{ slug: next.slug }}
        className="group relative isolate block overflow-hidden bg-charcoal text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <SiteImage
          image={next.image}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full opacity-40 transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-60 motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent" />
        <Container className="flex items-center justify-between gap-8 py-16 lg:py-24">
          <div>
            <p className="eyebrow text-white/60">
              {t.service.next} · {pad(((index + 1) % allServices.length) + 1)}
            </p>
            <p className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="underline-draw">{next.title}</span>
            </p>
          </div>
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-500 group-hover:border-primary group-hover:bg-primary lg:size-24">
            <ArrowRight aria-hidden="true" className="size-6 transition-transform duration-500 group-hover:translate-x-1 lg:size-8" />
          </span>
        </Container>
      </Link>

      <CtaBand
        title={t.service.ctaTitle(service.title)}
        text={t.service.ctaText}
        search={{ service: service.slug }}
      />
    </>
  );
}