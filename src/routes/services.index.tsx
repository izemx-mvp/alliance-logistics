import { useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { PageHero } from "@/components/site/page-hero";
import { ProcessRoute } from "@/components/site/process-route";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { SiteImage } from "@/components/site/site-image";
import { getServices, type Service } from "@/data/services";
import { getDictionary, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/services",
      title: t.services.seoTitle,
      description: t.services.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.services, path: "/services" },
          ],
          lang,
        ),
      ],
    });
  },
  component: ServicesPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

/* ================================================================== */
/* Interactive index: big typographic list + sticky photo preview      */
/* ================================================================== */

function ServicesIndex({ services }: { services: Service[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const current = services[active] ?? services[0]!;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <CrossroadsMotif className="absolute -right-32 top-10 h-96 w-96 motif-faint" />
      <Container>
        <SectionHeading eyebrow={t.services.grid.eyebrow} title={t.services.grid.title} />

        {/* Desktop: list + sticky preview */}
        <div className="mt-14 hidden gap-12 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
          <ul className="border-t border-border">
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.slug} className="border-b border-border">
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative flex items-center gap-6 py-7 outline-none focus-visible:bg-secondary"
                  >
                    {/* red fill sweeping in */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-0 left-0 -z-10 bg-secondary transition-[width] duration-500 ease-out",
                        isActive ? "w-full" : "w-0",
                      )}
                    />
                    <span
                      className={cn(
                        "w-12 shrink-0 pl-2 font-mono text-sm transition-colors duration-300",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-display text-3xl font-bold leading-tight transition-all duration-500 xl:text-4xl",
                        isActive
                          ? "translate-x-2 text-foreground"
                          : "text-transparent [-webkit-text-stroke:1px_#8e8e8e]",
                      )}
                    >
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        "mr-2 grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        isActive
                          ? "rotate-45 border-primary bg-primary text-white"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      <ArrowUpRight aria-hidden="true" className="size-5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative">
            <div className="sticky top-28">
              <div className="relative p-3">
                <CornerBrackets tone="red" className="absolute inset-0" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal">
                  {services.map((s, i) => (
                    <div
                      key={s.slug}
                      aria-hidden={i !== active}
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-out",
                        i === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                      )}
                    >
                      <SiteImage
                        image={s.image}
                        sizes="(min-width: 1024px) 40vw, 0px"
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent"
                  />
                  <div
                    key={current.slug}
                    className="absolute inset-x-0 bottom-0 p-8 text-white animate-in fade-in-0 slide-in-from-bottom-3 duration-500"
                  >
                    <ServiceIcon icon={current.icon} className="size-10 text-white" />
                    <p className="mt-4 text-base leading-relaxed text-white/85">{current.short}</p>
                    <Button asChild className="mt-6">
                      <Link to="/services/$slug" params={{ slug: current.slug }}>
                        {t.services.discover} <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                  <span className="absolute right-6 top-5 font-mono text-sm text-white/70">
                    {pad(active + 1)} / {pad(services.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: photo cards */}
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
          {services.map((s, i) => (
            <StaggerItem key={s.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white"
              >
                <SiteImage
                  image={s.image}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 -z-20 h-full w-full"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent"
                />
                <span className="absolute right-5 top-4 font-mono text-sm text-white/70">
                  {pad(i + 1)}
                </span>
                <ServiceIcon icon={s.icon} className="size-9 text-white" />
                <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/80">{s.short}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Integrated offer: container doors opening on scroll                 */
/* ================================================================== */

function ContainerDoorsReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 50%"] });
  const doorLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const doorRight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  const doorPattern =
    "bg-[#3a3a3a] [background-image:repeating-linear-gradient(90deg,#2b2b2b_0_10px,#3d3d3d_10px_22px)]";

  return (
    <div ref={ref} className="relative p-3">
      <CornerBrackets tone="light" className="absolute inset-0" />
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal">
        <motion.div style={{ scale: reduce ? 1 : imgScale }} className="absolute inset-0">
          <SiteImage
            image="serviceDouane"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full"
          />
        </motion.div>
        {!reduce && (
          <>
            <motion.div
              aria-hidden="true"
              style={{ x: doorLeft }}
              className={cn("absolute inset-y-0 left-0 w-1/2 border-r-2 border-black/40", doorPattern)}
            >
              <span className="absolute right-6 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-primary shadow" />
              <span className="absolute right-12 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-primary/80 shadow" />
            </motion.div>
            <motion.div
              aria-hidden="true"
              style={{ x: doorRight }}
              className={cn("absolute inset-y-0 right-0 w-1/2 border-l-2 border-black/40", doorPattern)}
            >
              <span className="absolute left-6 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-primary shadow" />
              <span className="absolute left-12 top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-primary/80 shadow" />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

function ServicesPage() {
  const t = useT();
  const lang = useLang();
  const services = getServices(lang);

  return (
    <>
      <PageHero
        image="servicesHero"
        eyebrow={t.services.hero.eyebrow}
        title={t.services.hero.title}
        intro={t.services.hero.text}
        crumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.services }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/cotation">
              {t.nav.quote} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {/* quick jump chips */}
        <ul className="mt-8 flex flex-wrap gap-2">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-primary hover:ring-primary"
              >
                <span className="font-mono text-white/60">{pad(i + 1)}</span>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <ServicesIndex services={services} />

      {/* Integrated offer */}
      <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white lg:py-28">
        <CrossroadsMotif className="absolute -left-24 -top-24 -z-10 h-96 w-96 text-white/[0.05]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-0 -z-10 select-none font-display text-[16vw] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
        >
          1 = 1
        </span>
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow={t.services.integrated.eyebrow}
              title={t.services.integrated.title}
              text={t.services.integrated.text}
            />
            <Stagger as="ul" className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
              {t.services.integrated.points.map((p, i) => (
                <StaggerItem
                  as="li"
                  key={p}
                  className="group flex items-start gap-4 bg-charcoal p-5 transition-colors hover:bg-[#333]"
                >
                  <span className="font-mono text-xs text-white/40">{pad(i + 1)}</span>
                  <span className="flex-1 text-sm font-medium text-white/90">{p}</span>
                  <Check aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-125 motion-reduce:transform-none" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal>
            <ContainerDoorsReveal />
          </Reveal>
        </Container>
      </section>

      <ProcessRoute
        eyebrow={t.home.process.eyebrow}
        title={t.home.process.title}
        steps={t.home.process.steps}
        footer={
          <Button asChild size="lg">
            <Link to="/cotation">
              {t.nav.quote} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <CtaBand />
    </>
  );
}