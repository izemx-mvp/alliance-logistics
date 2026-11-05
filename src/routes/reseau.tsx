import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Headset,
  MapPin,
  PackageCheck,
  PackageOpen,
  Plane,
  Ship,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif, SampleTag } from "@/components/site/motif";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { SiteImage } from "@/components/site/site-image";
import { WorldMap, type MapPoint, type MapView } from "@/components/site/world-map";
import { site } from "@/config/site";
import {
  CONTINENTS,
  MODE_LABELS,
  networkCountries,
  project,
  type Continent,
  type NetworkCountry,
  type NetworkMode,
} from "@/data/network";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reseau")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/reseau",
      title: t.network.seoTitle,
      description: t.network.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.network, path: "/reseau" },
          ],
          lang,
        ),
      ],
    });
  },
  component: ReseauPage,
});

type Filter = Continent | "all";

/** Map region shown for each filter (map units, 1000×500, ~2:1, Casablanca always in frame). */
const VIEWS: Record<Filter, MapView> = {
  all: { x: 0, y: 0, w: 1000, h: 500 },
  europe: { x: 435, y: 55, w: 230, h: 115 },
  afrique: { x: 405, y: 105, w: 240, h: 120 },
  "moyen-orient": { x: 450, y: 90, w: 240, h: 120 },
  asie: { x: 425, y: 50, w: 440, h: 220 },
  ameriques: { x: 160, y: 85, w: 480, h: 240 },
  oceanie: { x: 425, y: 95, w: 540, h: 270 },
};

const MODE_ICON: Record<NetworkMode, typeof Ship> = {
  maritime: Ship,
  aerien: Plane,
  routier: Truck,
};

function continentLabel(id: Continent, lang: "fr" | "en") {
  return CONTINENTS.find((c) => c.id === id)?.label[lang] ?? id;
}

/* ================================================================== */
/* Hero + figures ribbon                                               */
/* ================================================================== */

function NetworkHero() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-kenburns h-full w-full">
          <SiteImage image="reseauHero" priority decorative sizes="100vw" className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-charcoal to-transparent" />
      <CrossroadsMotif className="absolute -left-24 bottom-10 -z-10 h-[26rem] w-[26rem] text-white/[0.05]" />

      <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-40 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pb-48 lg:pt-44">
        <div className="hero-in">
          <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.network }]} dark className="mb-6" />
          <p className="eyebrow text-white/80">{t.network.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.04] text-balance sm:text-6xl xl:text-7xl">
            {t.network.hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">{t.network.hero.text}</p>
        </div>
        <div aria-hidden="true" className="hero-in hidden select-none justify-self-end text-right lg:block">
          <p className="font-display text-[11rem] font-bold leading-[0.8] tracking-tight text-transparent drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] xl:text-[13rem]">
            {site.stats.agents}
          </p>
          <p className="mt-4 flex items-center justify-end gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            <span className="h-px w-10 bg-primary" />
            {t.network.counters.agents}
          </p>
        </div>
      </div>
    </section>
  );
}

function FiguresRibbon() {
  const t = useT();
  const locale = intlLocale(useLang());
  const figures = [
    { value: site.stats.agents, prefix: "~", label: t.network.counters.agents },
    { value: new Set(networkCountries.map((c) => c.continent)).size, label: t.network.counters.continents },
    { value: networkCountries.length, label: t.network.counters.countries },
  ];
  return (
    <div className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <Stagger className="grid grid-cols-3 overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
          {figures.map((f, i) => (
            <StaggerItem
              key={f.label}
              className={cn("group relative px-3 py-5 sm:p-8 lg:p-10", i > 0 && "border-l border-border")}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <p className="font-display text-5xl font-bold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_#2b2b2b] group-hover:text-primary group-hover:[-webkit-text-stroke:1.5px_#c8102e] max-sm:text-3xl max-sm:[-webkit-text-stroke:1px_#2b2b2b] sm:text-6xl">
                <CountUp value={f.value} prefix={f.prefix} locale={locale} />
              </p>
              <p className="mt-2 text-xs text-muted-foreground sm:mt-4 sm:text-sm">{f.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}

/* ================================================================== */
/* Interactive map + country panel                                     */
/* ================================================================== */

function ModeIcons({ modes, className }: { modes: NetworkMode[]; className?: string }) {
  const lang = useLang();
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      {modes.map((m) => {
        const Icon = MODE_ICON[m];
        return (
          <span key={m} title={MODE_LABELS[m][lang]} className="grid size-7 place-items-center rounded-md bg-white/10">
            <Icon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{MODE_LABELS[m][lang]}</span>
          </span>
        );
      })}
    </span>
  );
}

function CountryDetail({ country, onClose }: { country: NetworkCountry; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={country.code}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative mt-4 overflow-hidden rounded-xl bg-white p-5 text-charcoal shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] lg:absolute lg:bottom-6 lg:right-6 lg:mt-0 lg:w-80"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 -right-1 font-display text-8xl font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(43,43,43,0.12)]"
      >
        {country.code}
      </span>
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {continentLabel(country.continent, lang)}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold">{country.name[lang]}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.network.close}
          className="relative grid size-8 shrink-0 place-items-center rounded-full bg-secondary transition-colors hover:bg-charcoal hover:text-white"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t.network.hubs}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {country.hubs.map((h) => (
          <li key={h} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            <MapPin aria-hidden="true" className="size-3 text-primary" />
            {h}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t.network.modes}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {country.modes.map((m) => {
          const Icon = MODE_ICON[m];
          return (
            <li key={m} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium">
              <Icon aria-hidden="true" className="size-3.5 text-primary" />
              {MODE_LABELS[m][lang]}
            </li>
          );
        })}
      </ul>
      <Button asChild size="sm" className="mt-5 w-full">
        <Link to="/cotation">
          {t.network.quoteCta} <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </motion.div>
  );
}

function NetworkExplorer() {
  const t = useT();
  const lang = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const selectedCountry = networkCountries.find((c) => c.code === selected) ?? null;
  const visible = useMemo(
    () => networkCountries.filter((c) => filter === "all" || c.continent === filter),
    [filter],
  );
  const view = VIEWS[selectedCountry && filter === "all" ? selectedCountry.continent : filter];

  const points: MapPoint[] = networkCountries.map((c) => {
    const inFilter = filter === "all" || c.continent === filter;
    return {
      id: c.code,
      name: c.hubs[0] ?? c.name[lang],
      ...project(c.lat, c.lon),
      active: inFilter && (selected === null || selected === c.code),
      // On the full world view only the selected country is labelled (avoids clutter over Europe).
      hideLabel: filter === "all" && !(selectedCountry && selected === c.code),
    };
  });

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t.network.all, count: networkCountries.length },
    ...CONTINENTS.map((c) => ({
      id: c.id,
      label: c.label[lang],
      count: networkCountries.filter((n) => n.continent === c.id).length,
    })),
  ];

  const select = (code: string) => setSelected((s) => (s === code ? null : code));

  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-white lg:py-28">
      <CrossroadsMotif className="absolute -right-32 -top-32 -z-10 h-[32rem] w-[32rem] text-white/[0.04]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_40%,rgba(200,16,46,0.12),transparent_60%)]" />
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading dark eyebrow={t.network.mapTitle} title={t.home.network.title} text={t.network.mapText} />
        </div>

        {/* continent tabs */}
        <Reveal className="mt-10">
          <div role="group" aria-label={t.network.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(tab.id);
                    setSelected(null);
                  }}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/40 hover:text-white",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[0.7rem] tabular-nums",
                      active ? "bg-white/20" : "bg-white/10 text-white/60",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* map */}
          <Reveal className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <CornerBrackets tone="light" className="absolute inset-3" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative">
              <WorldMap
                points={points}
                tone="dark"
                showLabels
                view={view}
                onPointClick={select}
                title={t.network.mapAria}
              />
            </div>
            <div className="relative mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
              <p className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Casablanca · HQ
              </p>
              {!selectedCountry && <p>{t.network.selectHint}</p>}
            </div>
            <AnimatePresence mode="wait">
              {selectedCountry && (
                <CountryDetail key={selectedCountry.code} country={selectedCountry} onClose={() => setSelected(null)} />
              )}
            </AnimatePresence>
          </Reveal>

          {/* side panel */}
          <Reveal delay={0.1} className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm lg:h-0 lg:min-h-full">
            <div className="flex items-center justify-between gap-3 px-1 pt-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {t.network.panelTitle}
              </h3>
              <span className="text-xs tabular-nums text-white/40">{visible.length}</span>
            </div>
            {visible.length === 0 ? (
              <p className="mt-3 px-1 text-sm text-white/60">{t.network.empty}</p>
            ) : (
              <ul className="dark-scroll mt-2 max-h-80 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 lg:max-h-none" aria-live="polite">
                {visible.map((c) => {
                  const isSel = selected === c.code;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        aria-pressed={isSel}
                        onClick={() => select(c.code)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                          isSel ? "bg-primary text-white" : "hover:bg-white/[0.07]",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-md font-mono text-xs font-bold",
                            isSel ? "bg-white/20" : "bg-white/10 text-white/80",
                          )}
                        >
                          {c.code}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{c.name[lang]}</span>
                          <span className={cn("block truncate text-xs", isSel ? "text-white/80" : "text-white/50")}>
                            {c.hubs.join(" · ")}
                          </span>
                        </span>
                        <ModeIcons modes={c.modes} className={isSel ? "" : "text-white/70"} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 px-1 pt-3">
              <SampleTag className="border-white/30 text-white/60" />
              <p className="text-[0.7rem] leading-snug text-white/45">{t.network.sampleNote}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* How the network works                                               */
/* ================================================================== */

const HOW_ICONS = [PackageOpen, Headset, PackageCheck];

function HowItWorks() {
  const t = useT();
  const how = t.network.how;
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeading align="center" eyebrow={how.eyebrow} title={how.title} />
        <div className="relative mt-16">
          {/* dashed route behind the steps */}
          <svg aria-hidden="true" className="absolute left-[16%] right-[16%] top-10 hidden h-2 w-[68%] lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <line x1="0" y1="1" x2="100" y2="1" className="route-dash stroke-primary/60" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          <Stagger className="relative grid gap-6 lg:grid-cols-3 lg:gap-10">
            {how.steps.map((step, i) => {
              const Icon = HOW_ICONS[i] ?? MapPin;
              const hub = i === 1;
              return (
                <StaggerItem key={step.title} className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative grid size-20 place-items-center rounded-full ring-8 ring-white",
                      hub ? "bg-primary text-white shadow-[0_16px_40px_-12px_rgba(200,16,46,0.7)]" : "bg-charcoal text-white",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-8" />
                    <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-white font-display text-xs font-bold text-charcoal shadow-card">
                      {i + 1}
                    </span>
                  </span>
                  <div
                    className={cn(
                      "group relative mt-6 w-full rounded-2xl p-7",
                      hub ? "bg-charcoal text-white" : "bg-secondary",
                    )}
                  >
                    <CornerBrackets size="sm" tone={hub ? "light" : "grey"} className="absolute inset-3" />
                    <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                    <p className={cn("mt-3 leading-relaxed", hub ? "text-white/75" : "text-muted-foreground")}>
                      {step.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */

function ReseauPage() {
  return (
    <>
      <NetworkHero />
      <FiguresRibbon />
      <div className="h-20 lg:h-24" />
      <NetworkExplorer />
      <HowItWorks />
      <CtaBand />
    </>
  );
}