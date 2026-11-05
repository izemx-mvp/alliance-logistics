import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Anchor,
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  Check,
  Clock,
  FileCheck2,
  Globe2,
  Plane,
  Quote,
  Search,
  ShieldCheck,
  Ship,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/site/cards";
import { ProcessRoute } from "@/components/site/process-route";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif, SampleTag } from "@/components/site/motif";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { SiteImage } from "@/components/site/site-image";
import { TrackingTimeline } from "@/components/site/tracking-timeline";
import { site } from "@/config/site";
import { sortedPosts } from "@/data/posts";
import { getServices, type Service, type ServiceSlug } from "@/data/services";
import { shipments } from "@/data/shipments";
import {
  getDictionary,
  intlLocale,
  langFromSearch,
  useLang,
  useT,
  type Lang,
} from "@/i18n";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/",
      title: t.home.seoTitle,
      description: t.home.seoDescription,
    });
  },
  component: HomePage,
});

/* ================================================================== */
/* Data local to the homepage                                          */
/* ================================================================== */

const MODES: {
  key: "maritime" | "aerien" | "routier";
  image: ImageKey;
  service: ServiceSlug;
  Icon: typeof Ship;
}[] = [
  { key: "maritime", image: "modeMaritime", service: "transport-international", Icon: Ship },
  { key: "aerien", image: "modeAerien", service: "transport-international", Icon: Plane },
  { key: "routier", image: "modeRoutier", service: "transport-national-entreposage", Icon: Truck },
];

const WHY_ICONS = [FileCheck2, UserRound, Boxes, Globe2];

/** Cities from the agents network (src/data/network.ts countries). Decorative marquee. */
const MARQUEE_CITIES = [
  "Shanghai",
  "Rotterdam",
  "Dubaï",
  "Marseille",
  "Algésiras",
  "Anvers",
  "Istanbul",
  "Hambourg",
  "Dakar",
  "Abidjan",
  "Montréal",
  "New York",
  "Santos",
  "Mumbai",
  "Busan",
  "Valence",
];

type BoardRow = {
  city: string;
  mode: "sea" | "air" | "road";
  status: { fr: string; en: string };
  tone: "ok" | "live" | "wait";
};

/** Illustrative departures board (not real operations). */
const BOARD_ROWS: BoardRow[] = [
  { city: "SHANGHAI", mode: "sea", status: { fr: "EN TRANSIT", en: "IN TRANSIT" }, tone: "live" },
  { city: "ROTTERDAM", mode: "sea", status: { fr: "EMBARQUÉ", en: "LOADED" }, tone: "ok" },
  { city: "DUBAI", mode: "air", status: { fr: "DÉCOLLÉ", en: "DEPARTED" }, tone: "ok" },
  { city: "MARSEILLE", mode: "road", status: { fr: "EN DOUANE", en: "IN CUSTOMS" }, tone: "wait" },
  { city: "ISTANBUL", mode: "road", status: { fr: "CHARGEMENT", en: "LOADING" }, tone: "wait" },
  { city: "MONTREAL", mode: "air", status: { fr: "LIVRÉ", en: "DELIVERED" }, tone: "ok" },
  { city: "DAKAR", mode: "sea", status: { fr: "EN TRANSIT", en: "IN TRANSIT" }, tone: "live" },
  { city: "HAMBOURG", mode: "sea", status: { fr: "DÉDOUANÉ", en: "CLEARED" }, tone: "ok" },
];

const BOARD_LABELS: Record<Lang, { title: string; dest: string; mode: string; status: string; note: string }> = {
  fr: {
    title: "Départs · Casablanca",
    dest: "Destination",
    mode: "Mode",
    status: "Statut",
    note: "Illustration",
  },
  en: {
    title: "Departures · Casablanca",
    dest: "Destination",
    mode: "Mode",
    status: "Status",
    note: "Illustration",
  },
};

const MODE_ICON = { sea: Ship, air: Plane, road: Truck } as const;

/* ================================================================== */
/* Split-flap departures board                                         */
/* ================================================================== */

function FlapText({ text, width }: { text: string; width: number }) {
  const chars = text.padEnd(width, " ").slice(0, width).split("");
  return (
    <span className="inline-flex gap-[2px]" aria-hidden="true">
      {chars.map((c, i) => (
        <span
          // key includes the char so it re-mounts and replays the flip when it changes
          key={`${i}-${c}`}
          className="flap-char grid h-7 w-[1.15rem] place-items-center rounded-[3px] bg-[#1b1b1b] font-mono text-[0.8rem] font-semibold text-[#f4f4f5] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06),inset_0_1px_0_rgba(0,0,0,0.6)] sm:h-8 sm:w-[1.3rem] sm:text-sm"
          style={{ animationDelay: `${i * 35}ms` }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

function DeparturesBoard() {
  const lang = useLang();
  const reduce = useReducedMotion();
  const labels = BOARD_LABELS[lang];
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setOffset((o) => (o + 1) % BOARD_ROWS.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const rows = Array.from({ length: 5 }, (_, i) => BOARD_ROWS[(offset + i) % BOARD_ROWS.length]!);

  return (
    <div className="relative rounded-2xl bg-[#111]/90 p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-md sm:p-6">
      <CornerBrackets tone="light" className="absolute inset-2" />
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <p className="eyebrow flex items-center gap-2 text-white">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {labels.title}
        </p>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white/60">
          {labels.note}
        </span>
      </div>

      {/* accessible version */}
      <table className="sr-only">
        <caption>{labels.title}</caption>
        <thead>
          <tr>
            <th>{labels.dest}</th>
            <th>{labels.mode}</th>
            <th>{labels.status}</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_ROWS.map((r) => (
            <tr key={r.city}>
              <td>{r.city}</td>
              <td>{r.mode}</td>
              <td>{r.status[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div aria-hidden="true" className="mt-4 grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
        <span>{labels.dest}</span>
        <span className="text-center">{labels.mode}</span>
        <span className="text-right">{labels.status}</span>
        {rows.map((r, i) => {
          const Icon = MODE_ICON[r.mode];
          return (
            <div key={`${offset}-${i}`} className="contents">
              <FlapText text={r.city} width={9} />
              <span className="grid size-8 place-items-center rounded-md bg-white/5">
                <Icon className="size-4 text-white/80" />
              </span>
              <span
                className={cn(
                  "justify-self-end rounded-md px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold tracking-wider",
                  r.tone === "ok" && "bg-white/10 text-white",
                  r.tone === "live" && "bg-primary text-white",
                  r.tone === "wait" && "bg-amber-400/15 text-amber-300",
                )}
              >
                {r.status[lang]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Hero tracking form                                                  */
/* ================================================================== */

function HeroTrackForm() {
  const t = useT();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void navigate({
      to: "/suivi",
      search: (prev) => ({ ...prev, ref: value.trim() || undefined }),
    });
  };
  return (
    <form onSubmit={onSubmit} role="search" className="mt-10 max-w-md">
      <label htmlFor="hero-track" className="eyebrow text-white/70">
        {t.home.hero.trackLabel}
      </label>
      <div className="mt-3 flex rounded-xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-md transition focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-primary">
        <Search aria-hidden="true" className="ml-2 size-4 self-center text-white/60" />
        <input
          id="hero-track"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.home.hero.trackPlaceholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/55 focus:outline-none"
        />
        <Button type="submit" size="sm" className="h-10 px-5">
          {t.home.hero.trackButton}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </form>
  );
}

/* ================================================================== */
/* Destinations marquee                                                */
/* ================================================================== */

function DestinationsMarquee() {
  const icons = [Ship, Plane, Truck, Anchor];
  const row = MARQUEE_CITIES.map((city, i) => {
    const Icon = icons[i % icons.length]!;
    return (
      <span key={city} className="flex shrink-0 items-center gap-6 pr-6">
        <span className="font-display text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl">
          {city}
        </span>
        <Icon aria-hidden="true" className="size-5 opacity-70" />
      </span>
    );
  });
  return (
    <div
      aria-hidden="true"
      className="relative -rotate-1 overflow-hidden bg-primary py-5 text-white shadow-[0_20px_40px_-20px_rgba(200,16,46,0.6)]"
    >
      <div className="marquee flex w-max">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Services — pinned horizontal "container train" (desktop)            */
/* ================================================================== */

function ServicePanel({ service, index, cta }: { service: Service; index: number; cta: string }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative isolate flex h-full w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-charcoal p-8 text-white outline-none ring-primary focus-visible:ring-4 lg:p-10"
    >
      <SiteImage
        image={service.image}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="absolute inset-0 -z-20 h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-transparent" />
      {/* container-door ridges */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 w-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:repeating-linear-gradient(90deg,rgba(200,16,46,0.0)_0_18px,rgba(200,16,46,0.35)_18px_22px)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 right-6 font-display text-[9rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] lg:text-[12rem]"
      >
        0{index + 1}
      </span>
      <ServiceIcon icon={service.icon} className="size-11 text-white" />
      <h3 className="mt-5 max-w-md font-display text-3xl font-bold leading-tight lg:text-4xl">
        {service.title}
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-white/80">{service.short}</p>
      <span className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        {cta}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transform-none" />
      </span>
    </Link>
  );
}

function ServicesTrain({ services }: { services: Service[] }) {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // intro (35vw) + 6 panels (55vw each) = 365vw → travel 265vw
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-265vw"]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const intro = (
    <div className="flex flex-col justify-center">
      <SectionHeading
        eyebrow={t.home.services.eyebrow}
        title={t.home.services.title}
        text={t.home.services.text}
      />
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link to="/services">
            {t.home.services.all} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      {!reduce && (
        <section ref={ref} className="relative hidden h-[420vh] lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            <CrossroadsMotif className="absolute -right-32 top-10 h-96 w-96 motif-faint" />
            <motion.div style={{ x }} className="flex h-[72vh] items-stretch">
              <div className="w-[35vw] shrink-0 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-12">{intro}</div>
              {services.map((s, i) => (
                <div key={s.slug} className="w-[55vw] shrink-0 pr-6">
                  <ServicePanel service={s} index={i} cta={t.common.discover} />
                </div>
              ))}
            </motion.div>
            {/* progress rail */}
            <div className="mx-auto mt-8 flex w-full max-w-7xl items-center gap-4 px-8">
              <span className="font-mono text-xs text-muted-foreground">01</span>
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">0{services.length}</span>
            </div>
          </div>
        </section>
      )}

      {/* Mobile / reduced motion: stacked panels */}
      <section className={cn("py-20", !reduce && "lg:hidden")}>
        <Container>
          {intro}
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <div key={s.slug} className="h-[26rem]">
                <ServicePanel service={s} index={i} cta={t.common.discover} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ================================================================== */
/* Transport modes — expanding panels                                  */
/* ================================================================== */

function ModesAccordion() {
  const t = useT();
  const [active, setActive] = useState(0);

  return (
    <section className="bg-charcoal py-20 text-white lg:py-28">
      <Container>
        <SectionHeading dark eyebrow={t.home.modes.eyebrow} title={t.home.modes.title} text={t.home.modes.text} />

        <div
          role="tablist"
          aria-label={t.home.modes.tabsLabel}
          className="mt-12 flex flex-col gap-3 lg:h-[34rem] lg:flex-row"
        >
          {MODES.map((m, i) => {
            const item = t.home.modes.items[m.key];
            const isActive = active === i;
            return (
              <div
                key={m.key}
                className={cn(
                  "group relative isolate overflow-hidden rounded-3xl transition-[flex-grow,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isActive ? "h-[30rem] lg:h-auto lg:grow-[3.2]" : "h-24 lg:h-auto lg:grow",
                )}
                style={{ flexBasis: 0 }}
                onMouseEnter={() => setActive(i)}
              >
                <SiteImage
                  image={m.image}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={cn(
                    "absolute inset-0 -z-20 h-full w-full transition-transform duration-[1400ms] ease-out",
                    isActive ? "scale-100" : "scale-110",
                  )}
                />
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 -z-10 transition-colors duration-700",
                    isActive
                      ? "bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"
                      : "bg-charcoal/75",
                  )}
                />

                <button
                  type="button"
                  role="tab"
                  id={`mode-tab-${m.key}`}
                  aria-selected={isActive}
                  aria-controls={`mode-panel-${m.key}`}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="absolute inset-x-0 top-0 flex items-center gap-4 p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary lg:inset-y-0 lg:flex-col lg:items-start lg:justify-between"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full ring-1 transition-colors duration-500",
                        isActive ? "bg-primary ring-primary" : "bg-white/10 ring-white/25",
                      )}
                    >
                      <m.Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-white/60">0{i + 1}</span>
                  </span>
                  {!isActive && (
                    <span className="font-display text-xl font-bold uppercase tracking-[0.2em] lg:[writing-mode:vertical-rl] lg:rotate-180">
                      {item.label}
                    </span>
                  )}
                </button>

                <div
                  role="tabpanel"
                  id={`mode-panel-${m.key}`}
                  aria-labelledby={`mode-tab-${m.key}`}
                  hidden={!isActive}
                  className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10"
                >
                  <div className="max-w-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                    <p className="eyebrow text-white/70">{item.label}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold sm:text-4xl">{item.title}</h3>
                    <p className="mt-3 hidden text-white/80 sm:block">{item.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.points.map((p) => (
                        <li
                          key={p}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/15 backdrop-blur-sm"
                        >
                          <Check aria-hidden="true" className="size-3.5 text-primary" /> {p}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-6">
                      <Link to="/services/$slug" params={{ slug: m.service }}>
                        {t.home.modes.cta} <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

function HomePage() {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const services = getServices(lang);
  const demoShipment = shipments[0];
  const latest = sortedPosts().slice(0, 3);

  const stats = [
    { value: site.stats.years, label: t.stats.years },
    { value: site.stats.agents, prefix: "~", label: t.stats.agents },
    { value: site.stats.team, prefix: "~", label: t.stats.team },
    { value: site.stats.responseHours, suffix: "h", label: t.stats.response },
  ];

  return (
    <>
      {/* 1 — Hero ------------------------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-charcoal text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
          <div className="animate-kenburns h-full w-full">
            <SiteImage image="heroPort" priority sizes="100vw" className="h-full w-full" />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/30" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-charcoal to-transparent" />
        <CrossroadsMotif className="absolute -left-24 bottom-0 -z-10 h-[28rem] w-[28rem] text-white/[0.05]" />

        {/* giant outlined word behind the content */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)]"
        >
          ALLIANCE
        </span>

        <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="hero-in">
            <p className="eyebrow flex items-center gap-3 text-white/80">
              <span aria-hidden="true" className="h-px w-10 bg-primary" />
              {t.home.hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.02] text-balance sm:text-6xl xl:text-[4.5rem]">
              {t.home.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{t.home.hero.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-[0_12px_32px_-12px_rgba(200,16,46,0.7)]">
                <Link to="/cotation">
                  {t.home.hero.primary} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <Link to="/services">{t.home.hero.secondary}</Link>
              </Button>
            </div>
            <HeroTrackForm />
            <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.home.trust.certTitle}>
              {site.certifications.map((c) => (
                <li
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <ShieldCheck aria-hidden="true" className="size-3.5 text-primary" />
                  {c.label}
                </li>
              ))}
              <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 backdrop-blur-sm">
                <Clock aria-hidden="true" className="size-3.5 text-primary" />
                {site.stats.responseHours}h · {t.stats.response}
              </li>
            </ul>
          </div>

          <div className="relative hidden lg:block">
            <DeparturesBoard />
          </div>
        </div>
      </section>

      {/* 2 — Destinations marquee ------------------------------------- */}
      <DestinationsMarquee />

      {/* 3 — Key figures (huge outlined numbers) ---------------------- */}
      <section aria-label={site.name} className="py-20 lg:py-24">
        <Container>
          <Stagger className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="group border-l border-border pl-6">
                <p className="font-display text-6xl font-bold tabular-nums leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_#2b2b2b] group-hover:text-primary group-hover:[-webkit-text-stroke:1.5px_#c8102e] sm:text-7xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} locale={locale} />
                </p>
                <p className="mt-4 max-w-[12rem] text-sm text-muted-foreground">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 4 — Services: pinned horizontal train ------------------------ */}
      <ServicesTrain services={services} />

      {/* 5 — Transport modes: expanding panels ------------------------ */}
      <ModesAccordion />

      {/* 6 — Why us (office photo + pillars) -------------------------- */}
      <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white lg:py-28">
        <CrossroadsMotif className="absolute -right-20 -top-20 -z-10 h-[28rem] w-[28rem] text-white/[0.05]" />
        <Container className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal className="relative">
            <div className="relative p-3">
              <CornerBrackets tone="light" className="absolute inset-0" />
              <div className="relative overflow-hidden rounded-2xl">
                <SiteImage
                  image="aboutOffice"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              </div>
            </div>
            {/* floating stat card */}
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-white p-5 text-charcoal shadow-[0_24px_48px_-20px_rgba(0,0,0,0.5)] sm:right-8 sm:p-6">
              <p className="font-display text-4xl font-bold tabular-nums text-primary">
                <CountUp value={site.stats.years} locale={locale} />
              </p>
              <p className="mt-1 text-sm font-medium">{t.stats.years}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                2 {t.stats.generations}
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading dark eyebrow={t.home.why.eyebrow} title={t.home.why.title} />
            <Stagger className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
              {t.home.why.items.map((item, i) => {
                const Icon = WHY_ICONS[i] ?? Check;
                return (
                  <StaggerItem
                    key={item.title}
                    className="group relative bg-charcoal p-7 transition-colors duration-300 hover:bg-[#333]"
                  >
                    <span className="font-display text-xs font-semibold tracking-[0.3em] text-white/40">
                      0{i + 1}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="mt-4 size-8 text-primary transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none"
                    />
                    <h3 className="mt-5 font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">{item.text}</p>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full motion-reduce:transition-none"
                    />
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </Container>
      </section>


      {/* 6 — Process: scroll-drawn route ------------------------------ */}
      <ProcessRoute
        eyebrow={t.home.process.eyebrow}
        title={t.home.process.title}
        steps={t.home.process.steps}
        footer={
          <Button asChild size="lg">
            <Link to="/cotation">
              {t.home.hero.primary} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      {/* 7 — Network (night globe) ------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-charcoal py-24 text-white lg:py-32">
        <SiteImage
          image="reseauHero"
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/10"
        />
        <Container>
          <div className="max-w-xl">
            <SectionHeading
              dark
              eyebrow={t.home.network.eyebrow}
              title={t.home.network.title}
              text={t.home.network.text}
            />
            <Reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="bg-charcoal/70 p-6">
                <p className="font-display text-4xl font-bold tabular-nums text-white">
                  <CountUp value={site.stats.agents} prefix="~" locale={locale} />
                </p>
                <p className="mt-1 text-sm text-white/70">{t.network.counters.agents}</p>
              </div>
              <div className="bg-charcoal/70 p-6">
                <p className="font-display text-4xl font-bold tabular-nums text-white">
                  <CountUp value={6} />
                </p>
                <p className="mt-1 text-sm text-white/70">{t.network.counters.continents}</p>
              </div>
            </Reveal>
            <Reveal className="mt-8">
              <Button asChild>
                <Link to="/reseau">
                  {t.home.network.cta} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 8 — Tracking teaser (night terminal) ------------------------- */}
      <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white lg:py-28">
        <SiteImage image="suiviHero" sizes="100vw" className="absolute inset-0 -z-20 h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/85" />
        <CrossroadsMotif className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 text-white/[0.05]" />
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="self-center">
            <SectionHeading
              dark
              eyebrow={t.home.tracking.eyebrow}
              title={t.home.tracking.title}
              text={t.home.tracking.text}
            />
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/suivi">
                  {t.home.tracking.cta} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/espace-client">{t.home.tracking.secondary}</Link>
              </Button>
            </Reveal>
          </div>
          {demoShipment && (
            <Reveal className="relative rounded-2xl border border-white/10 bg-charcoal/60 p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-8">
              <CornerBrackets tone="light" className="absolute inset-2" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-sm text-white/70">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  {t.home.tracking.preview}
                </p>
                <p className="font-display text-lg font-semibold tracking-wide">
                  {demoShipment.reference}
                </p>
              </div>
              <p className="mt-1 text-sm text-white/70">
                {demoShipment.route.from[lang]} → {demoShipment.route.to[lang]}
              </p>
              <TrackingTimeline
                dark
                shipment={demoShipment}
                className="mt-6 grid gap-x-6 sm:grid-cols-2 [&>li]:pb-6"
              />
            </Reveal>
          )}
        </Container>
      </section>

      {/* 9 — Trust: certifications + testimonials --------------------- */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow={t.home.trust.eyebrow} title={t.home.trust.title} />
          <Reveal className="mt-10">
            <h3 className="eyebrow text-muted-foreground">{t.home.trust.certTitle}</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {site.certifications.map((c) => (
                <li
                  key={c.label}
                  className="group relative flex items-center gap-4 rounded-xl border border-border bg-white p-5 transition-shadow duration-300 hover:shadow-card"
                >
                  <CornerBrackets size="sm" className="absolute inset-2" />
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
                    <Award aria-hidden="true" className="size-6 text-primary transition-colors duration-300 group-hover:text-white" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{c.label}</p>
                    <p className="text-sm text-muted-foreground">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-14 flex items-center gap-3">
            <SampleTag />
          </div>
          <Stagger className="mt-4 grid gap-6 md:grid-cols-3">
            {t.home.trust.testimonials.map((item, i) => (
              <StaggerItem
                key={item.author}
                as="article"
                className={cn(
                  "relative flex flex-col rounded-2xl p-7",
                  i === 1 ? "bg-charcoal text-white" : "bg-secondary",
                )}
              >
                <Quote aria-hidden="true" className="size-9 text-primary" />
                <blockquote className={cn("mt-4 flex-1 leading-relaxed", i === 1 ? "text-white/90" : "text-foreground")}>
                  “{item.quote}”
                </blockquote>
                <div className={cn("mt-6 border-t pt-5", i === 1 ? "border-white/15" : "border-border")}>
                  <p className="text-sm font-semibold">{item.author}</p>
                  <p className={cn("text-sm", i === 1 ? "text-white/60" : "text-muted-foreground")}>
                    {item.company}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 10 — Latest news --------------------------------------------- */}
      <section className="bg-secondary py-20 lg:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow={t.home.news.eyebrow} title={t.home.news.title} />
            <Reveal>
              <Button asChild variant="outline">
                <Link to="/actualites">
                  {t.home.news.all} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <StaggerItem key={post.slug}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 11 — CTA ------------------------------------------------------ */}
      <CtaBand />
    </>
  );
}