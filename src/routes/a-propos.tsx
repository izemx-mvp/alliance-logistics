import { useId, useRef } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif, SampleTag } from "@/components/site/motif";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { SiteImage } from "@/components/site/site-image";
import { site } from "@/config/site";
import { getServices, type Service } from "@/data/services";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/a-propos")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/a-propos",
      title: t.about.seoTitle,
      description: t.about.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.about, path: "/a-propos" },
          ],
          lang,
        ),
      ],
    });
  },
  component: AboutPage,
});

const VALUE_ICONS = [ShieldCheck, Sparkles, HeartHandshake, Target];
const OUTLINE_DARK = "[-webkit-text-stroke:1.5px_#2b2b2b]";

/* ================================================================== */
/* 1 — Hero                                                            */
/* ================================================================== */

function AboutHero() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-kenburns h-full w-full">
          <SiteImage image="aboutOffice" priority decorative sizes="100vw" className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/25" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-charcoal to-transparent" />
      <CrossroadsMotif className="absolute -left-24 bottom-10 -z-10 h-[26rem] w-[26rem] text-white/[0.05]" />

      <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-40 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pb-48 lg:pt-44">
        <div className="hero-in">
          <Breadcrumbs
            items={[{ label: t.nav.home, href: "/" }, { label: t.nav.about }]}
            dark
            className="mb-6"
          />
          <p className="eyebrow text-white/80">{t.about.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.04] text-balance sm:text-6xl xl:text-7xl">
            {t.about.hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">{t.about.hero.text}</p>
        </div>

        {/* giant outlined "45" — the page's signature */}
        <div aria-hidden="true" className="hero-in relative hidden select-none justify-self-end lg:block">
          <p className="font-display text-[13rem] font-bold leading-[0.8] tracking-tight text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] xl:text-[16rem]">
            {site.yearsOfExperience}
          </p>
          <p className="mt-4 flex items-center justify-end gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            <span className="h-px w-10 bg-primary" />
            {t.stats.years}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2 — Figures ribbon (overlaps the hero)                              */
/* ================================================================== */

function FiguresRibbon() {
  const t = useT();
  const locale = intlLocale(useLang());
  const figures = [
    { value: site.yearsOfExperience, label: t.stats.years },
    { value: site.generations, label: t.stats.generations },
    { value: site.stats.team, prefix: "~", label: t.stats.team },
    { value: site.stats.agents, prefix: "~", label: t.stats.agents },
  ];
  return (
    <div className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <Stagger className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 lg:grid-cols-4">
          {figures.map((f, i) => (
            <StaggerItem
              key={f.label}
              className={cn(
                "group relative p-6 sm:p-8 lg:p-10",
                i % 2 === 1 && "border-l border-border",
                i >= 2 && "border-t border-border lg:border-t-0",
                i === 2 && "lg:border-l",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <p
                className={cn(
                  "font-display text-5xl font-bold leading-none text-transparent transition-colors duration-500 group-hover:text-primary group-hover:[-webkit-text-stroke:1.5px_#c8102e] sm:text-6xl",
                  OUTLINE_DARK,
                )}
              >
                <CountUp value={f.value} prefix={f.prefix} locale={locale} />
              </p>
              <p className="mt-4 max-w-[11rem] text-sm text-muted-foreground">{f.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}

/* ================================================================== */
/* 3 — Story with layered photo collage                                */
/* ================================================================== */

function Story() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);
  const yFront = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [90, -70]);

  return (
    <section className="py-24 lg:py-32">
      <Container className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* collage */}
        <div ref={ref} className="relative mx-auto mb-12 w-full max-w-lg pb-16 pr-10 lg:mb-0 lg:max-w-none">
          <motion.div style={{ y: yBack }} className="group relative p-3">
            <CornerBrackets className="absolute inset-0" />
            <div className="overflow-hidden rounded-2xl">
              <SiteImage
                image="serviceDouane"
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
              />
            </div>
          </motion.div>
          <motion.div
            style={{ y: yFront }}
            className="absolute -bottom-2 right-0 w-[58%] overflow-hidden rounded-2xl border-[6px] border-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)]"
          >
            <SiteImage image="modeMaritime" sizes="(min-width: 1024px) 24vw, 50vw" className="aspect-[4/3] w-full" />
          </motion.div>
          {/* generations badge */}
          <div className="absolute -left-3 top-10 rounded-2xl bg-primary px-5 py-4 text-white shadow-[0_20px_40px_-15px_rgba(200,16,46,0.7)] sm:-left-6">
            <p className="font-display text-4xl font-bold leading-none">{site.generations}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              {t.stats.generations}
            </p>
          </div>
        </div>

        {/* text */}
        <div>
          <SectionHeading eyebrow={t.about.story.eyebrow} title={t.about.story.title} />
          <Reveal className="mt-8">
            <p className="border-l-2 border-primary pl-6 font-display text-lg font-medium leading-relaxed text-foreground sm:text-2xl">
              {t.about.story.p1}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.about.story.p2}</p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-6">
            <Button asChild size="lg">
              <Link to="/contact">
                {t.about.story.cta} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <ul className="flex flex-wrap gap-2" aria-label={t.about.certifications.eyebrow}>
              {site.certifications.map((c) => (
                <li
                  key={c.label}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground"
                >
                  {c.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* 4 — Scroll-drawn timeline                                           */
/* ================================================================== */

function Timeline() {
  const t = useT();
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const items = t.about.timeline.items;

  return (
    <section className="relative isolate overflow-hidden bg-secondary py-24 lg:py-32">
      <CrossroadsMotif className="absolute -right-32 top-10 -z-10 h-[30rem] w-[30rem] motif-faint" />
      <Container>
        <div className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
          <SectionHeading
            align="center"
            eyebrow={t.about.timeline.eyebrow}
            title={t.about.timeline.title}
            className="lg:mx-auto"
          />
          <SampleTag />
        </div>

        <ol ref={ref} className="relative mt-16 lg:mt-24">
          {/* rail + progress fill */}
          <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-charcoal/10 lg:left-1/2 lg:-translate-x-1/2" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduced ? 1 : progress }}
            className="absolute bottom-2 left-[11px] top-2 w-0.5 origin-top bg-primary lg:left-1/2 lg:-translate-x-1/2"
          />

          {items.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={item.title}
                className="relative grid pb-14 pl-12 last:pb-0 lg:grid-cols-2 lg:gap-24 lg:pb-20 lg:pl-0"
              >
                {/* node */}
                <motion.span
                  aria-hidden="true"
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-0 top-1 grid size-6 place-items-center rounded-full bg-primary ring-[6px] ring-secondary lg:left-1/2 lg:-translate-x-1/2"
                >
                  <span className="size-2 rounded-full bg-white" />
                </motion.span>

                <Reveal
                  delay={0.05}
                  className={cn(
                    "group relative",
                    right ? "lg:col-start-2" : "lg:col-start-1 lg:text-right",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute -top-10 select-none font-display text-8xl font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(43,43,43,0.12)] lg:text-9xl",
                      right ? "right-0" : "right-0 lg:left-0 lg:right-auto",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <p className="relative font-display text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    {item.year}
                  </p>
                  <div className="relative mt-3 rounded-2xl bg-white p-6 shadow-card transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none sm:p-7">
                    <h3 className="font-display text-xl font-semibold sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* 5 — Mission (statement) & vision                                    */
/* ================================================================== */

function MissionVision() {
  const t = useT();
  const m = t.about.mission;
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-white lg:py-32">
      <SiteImage image="heroPort" decorative sizes="100vw" className="absolute inset-0 -z-20 h-full w-full opacity-25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal" />
      <CrossroadsMotif className="absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] text-white/[0.05]" />
      <Container>
        <Reveal>
          <p className="eyebrow text-white/70">{m.eyebrow}</p>
        </Reveal>

        <Reveal className="relative mt-10 max-w-5xl">
          <Quote aria-hidden="true" className="absolute -left-2 -top-6 size-16 text-primary/80 sm:-left-4" />
          <h2 className="pl-14 text-sm font-semibold uppercase tracking-[0.22em] text-white/60 sm:pl-16">
            {m.missionTitle}
          </h2>
          <p className="mt-4 pl-14 font-display text-2xl font-semibold leading-snug text-balance sm:pl-16 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
            {m.missionText}
          </p>
        </Reveal>

        <Reveal className="mt-16 grid gap-6 border-t border-white/15 pt-10 lg:mt-20 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <h2 className="flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
            <span aria-hidden="true" className="h-0.5 w-10 bg-primary" />
            {m.visionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-white/80 sm:text-xl">{m.visionText}</p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* 6 — Values as an editorial index                                    */
/* ================================================================== */

function Values() {
  const t = useT();
  return (
    <section className="py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={t.about.values.eyebrow} title={t.about.values.title} />
        </div>
        <Stagger as="ol" className="border-b border-border">
          {t.about.values.items.map((item, i) => {
            const Icon = VALUE_ICONS[i] ?? ShieldCheck;
            return (
              <StaggerItem
                as="li"
                key={item.title}
                className="group relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-border py-8 sm:grid-cols-[auto_auto_1fr] sm:items-center sm:gap-x-8 sm:py-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[-1px] h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full motion-reduce:transition-none"
                />
                <span className="col-start-1 row-start-1 font-display text-sm font-semibold tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                  0{i + 1}
                </span>
                <span className="col-start-2 row-start-1 flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
                    <Icon aria-hidden="true" className="size-5 text-primary transition-colors duration-300 group-hover:text-white" />
                  </span>
                  <h3 className="font-display text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none sm:w-52 sm:text-3xl">
                    {item.title}
                  </h3>
                </span>
                <p className="col-start-2 leading-relaxed text-muted-foreground sm:col-start-3 sm:row-start-1">{item.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* 7 — Organisation as a hub diagram                                   */
/* ================================================================== */

function PoleCard({ service, side }: { service: Service; side: "left" | "right" }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-card transition-colors hover:border-primary",
        // dashed connector towards the hub (desktop)
        "lg:after:absolute lg:after:top-1/2 lg:after:w-14 lg:after:border-t-2 lg:after:border-dashed lg:after:border-grey-soft lg:after:transition-colors lg:hover:after:border-primary",
        side === "left" ? "lg:flex-row-reverse lg:text-right lg:after:left-full" : "lg:after:right-full",
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
        <ServiceIcon icon={service.icon} className="size-7 text-charcoal transition-colors group-hover:text-primary" />
      </span>
      <span className="flex-1">
        <span className="block font-display font-semibold leading-snug">{service.title}</span>
        <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{service.short}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function Organisation() {
  const t = useT();
  const services = getServices(useLang());
  const left = services.slice(0, 3);
  const right = services.slice(3);
  const p = t.about.poles;

  return (
    <section className="relative isolate overflow-hidden bg-secondary py-24 lg:py-32">
      <Container>
        <SectionHeading align="center" eyebrow={p.eyebrow} title={p.title} text={p.text} />

        <div className="mt-16 grid items-center gap-6 lg:mt-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          {/* hub */}
          <Reveal className="order-first mx-auto lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="relative grid size-56 place-items-center sm:size-64">
              <svg aria-hidden="true" viewBox="0 0 100 100" className="spin-slow absolute inset-0 size-full text-primary">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" />
              </svg>
              <div className="relative grid size-44 place-items-center overflow-hidden rounded-full bg-charcoal text-center text-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] sm:size-52">
                <CrossroadsMotif className="absolute inset-0 m-auto size-40 text-white/[0.035]" />
                <div className="relative px-6">
                  <UserRound aria-hidden="true" className="mx-auto size-7 text-primary" />
                  <p className="mt-3 font-display text-lg font-semibold leading-tight">{p.hub}</p>
                  <p className="mt-2 text-xs leading-snug text-white/70">{p.hubText}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-start-1 lg:row-start-1 lg:grid-cols-1 lg:gap-5">
            {left.map((s) => (
              <StaggerItem key={s.slug}>
                <PoleCard service={s} side="left" />
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-start-3 lg:row-start-1 lg:grid-cols-1 lg:gap-5">
            {right.map((s) => (
              <StaggerItem key={s.slug}>
                <PoleCard service={s} side="right" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* 8 — Certifications as seals                                         */
/* ================================================================== */

function Seal({ label, detail }: { label: string; detail: string }) {
  const id = useId().replace(/:/g, "");
  const base = `${detail} • ${label} • `.toUpperCase();
  const ring = base.repeat(Math.max(1, Math.round(46 / base.length)));
  const fontSize = Math.min(12, Math.max(9, 500 / (ring.length * 0.8)));
  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative grid size-44 place-items-center sm:size-48">
        <svg aria-hidden="true" viewBox="0 0 200 200" className="spin-slow absolute inset-0 size-full text-charcoal/50 transition-colors duration-300 group-hover:text-primary">
          <defs>
            <path id={`seal-${id}`} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
          </defs>
          <text className="fill-current font-semibold" style={{ fontSize }}>
            <textPath href={`#seal-${id}`} textLength={508} lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        </svg>
        <div className="grid size-28 place-items-center rounded-full border-2 border-charcoal/10 bg-white shadow-card transition-colors duration-300 group-hover:border-primary sm:size-32">
          <p className="font-display text-2xl font-bold transition-colors group-hover:text-primary">{label}</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function Certifications() {
  const t = useT();
  const c = t.about.certifications;
  return (
    <section className="py-24 lg:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} text={c.text} />
        <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-4">
          {site.certifications.map((cert) => (
            <StaggerItem key={cert.label}>
              <Seal label={cert.label} detail={cert.detail} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ================================================================== */

function AboutPage() {
  return (
    <>
      <AboutHero />
      <FiguresRibbon />
      <Story />
      <Timeline />
      <MissionVision />
      <Values />
      <Organisation />
      <Certifications />
      <CtaBand />
    </>
  );
}