import { useEffect, useState, type FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Container as ContainerIcon,
  Download,
  FileText,
  FolderOpen,
  Info,
  Lock,
  MapPin,
  PackageCheck,
  PackageSearch,
  Plane,
  Search,
  Ship,
  Stamp,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container, SectionHeading } from "@/components/site/section";
import { SiteImage } from "@/components/site/site-image";
import { TrackingTimeline, formatDate } from "@/components/site/tracking-timeline";
import {
  TRACKING_STEP_COUNT,
  findShipment,
  normalizeReference,
  shipments,
  type Shipment,
  type ShipmentMode,
} from "@/data/shipments";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

type SuiviSearch = { ref?: string | undefined };

export const Route = createFileRoute("/suivi")({
  validateSearch: (search: Record<string, unknown>): SuiviSearch => {
    const ref = search["ref"];
    return typeof ref === "string" && ref.trim() ? { ref: ref.trim().slice(0, 32) } : {};
  },
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/suivi",
      title: t.tracking.seoTitle,
      description: t.tracking.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.tracking, path: "/suivi" },
          ],
          lang,
        ),
      ],
    });
  },
  component: SuiviPage,
});

const MODE_ICON: Record<ShipmentMode, typeof Ship> = {
  Maritime: Ship,
  Aérien: Plane,
  Routier: Truck,
};

/** Icon per tracking step; index 2 ("in transit") uses the shipment's mode icon. */
const STEP_ICONS = [FolderOpen, ContainerIcon, null, MapPin, Stamp, BadgeCheck, PackageCheck] as const;

function stepIcon(i: number, mode: ShipmentMode) {
  return STEP_ICONS[i] ?? MODE_ICON[mode];
}

function progressOf(s: Shipment) {
  return s.statusIndex / (TRACKING_STEP_COUNT - 1);
}

/** "Shanghai, Chine" → ["Shanghai", "Chine"] */
function splitPlace(place: string): [string, string] {
  const i = place.indexOf(",");
  return i === -1 ? [place, ""] : [place.slice(0, i), place.slice(i + 1).trim()];
}

/* ================================================================== */
/* Hero with search                                                    */
/* ================================================================== */

function TrackingHero({
  value,
  setValue,
  onSubmit,
  onDemo,
}: {
  value: string;
  setValue: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onDemo: (ref: string) => void;
}) {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-kenburns h-full w-full">
          <SiteImage image="suiviHero" priority decorative sizes="100vw" className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/30" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      <CrossroadsMotif className="absolute -left-24 bottom-0 -z-10 h-[26rem] w-[26rem] text-white/[0.05]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-24 lg:pt-44">
        <div className="hero-in max-w-3xl">
          <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.tracking }]} dark className="mb-6" />
          <p className="eyebrow text-white/80">{t.tracking.hero.eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] text-balance sm:text-6xl xl:text-7xl">
            {t.tracking.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{t.tracking.hero.text}</p>

          {/* search bar */}
          <form
            onSubmit={onSubmit}
            role="search"
            className="mt-10 rounded-2xl bg-white/10 p-2 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/20 backdrop-blur-md"
          >
            <label htmlFor="track-ref" className="sr-only">
              {t.tracking.label}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/60" />
                <input
                  id="track-ref"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={t.tracking.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-14 w-full rounded-xl bg-white/5 pl-12 pr-4 font-mono text-lg uppercase tracking-wider text-white outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/50 focus:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 rounded-xl px-7 text-base">
                {t.tracking.submit} <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </form>

          {/* demo shortcuts */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{t.tracking.tryDemo}
            {useLang() === "fr" ? " :" : ":"}</span>
            {shipments.map((s) => {
              const Icon = MODE_ICON[s.mode];
              return (
                <button
                  key={s.reference}
                  type="button"
                  onClick={() => onDemo(s.reference)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider ring-1 ring-white/15 transition-colors hover:bg-primary hover:ring-primary"
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {s.reference}
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-white/55">
            <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            {t.tracking.demoNote}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Result: header card with route                                      */
/* ================================================================== */

function RouteLine({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const lang = useLang();
  const reduced = useReducedMotion();
  const pct = progressOf(shipment) * 100;
  const Icon = MODE_ICON[shipment.mode];
  const [fromCity, fromCountry] = splitPlace(shipment.route.from[lang]);
  const [toCity, toCountry] = splitPlace(shipment.route.to[lang]);

  return (
    <div className="mt-10 grid grid-cols-2 items-center gap-x-4 gap-y-5 sm:grid-cols-[auto_1fr_auto] sm:gap-8">
      <div className="col-start-1 row-start-1">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/50">{t.tracking.origin}</p>
        <p className="mt-1 font-display text-xl font-bold sm:text-3xl">{fromCity}</p>
        <p className="text-xs text-white/60 sm:text-sm">{fromCountry}</p>
      </div>

      <div className="relative col-span-2 row-start-2 mx-5 h-10 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:mx-0" aria-hidden="true">
        <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/20" />
        <motion.span
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary"
        />
        <span className="absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        <span className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white/40 bg-charcoal" />
        <motion.span
          initial={reduced ? false : { left: "0%" }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-white shadow-[0_0_0_6px_rgba(200,16,46,0.25)]"
        >
          <Icon className="size-5" />
        </motion.span>
      </div>

      <div className="col-start-2 row-start-1 text-right sm:col-start-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/50">{t.tracking.destination}</p>
        <p className="mt-1 font-display text-xl font-bold sm:text-3xl">{toCity}</p>
        <p className="text-xs text-white/60 sm:text-sm">{toCountry}</p>
      </div>
    </div>
  );
}

function ShipmentHeader({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const pct = Math.round(progressOf(shipment) * 100);
  const last = shipment.events[shipment.events.length - 1];
  const facts = [
    { label: t.tracking.mode, value: t.tracking.modes[shipment.mode] },
    { label: t.tracking.goods, value: shipment.goods[lang] },
    { label: t.tracking.incoterm, value: shipment.incoterm },
    { label: t.tracking.eta, value: formatDate(shipment.eta, locale), date: shipment.eta },
  ];

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-charcoal p-6 text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-10">
      <CrossroadsMotif className="absolute -right-20 -top-20 h-80 w-80 text-white/[0.04]" />
      <CornerBrackets tone="light" className="absolute inset-4" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-white/60">{t.tracking.label}</p>
            <h2 className="mt-2 font-mono text-3xl font-bold tracking-wider sm:text-5xl">{shipment.reference}</h2>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              {t.tracking.steps[shipment.statusIndex]}
            </span>
            {last && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white/55">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {t.tracking.lastUpdate} · <time dateTime={last.date}>{formatDate(last.date, locale)}</time>
              </span>
            )}
          </div>
        </div>

        <RouteLine shipment={shipment} />

        {/* progress */}
        <div className="mt-8 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t.tracking.progress}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="block h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
            />
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">{pct}%</span>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-charcoal p-4 sm:p-5">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">{f.label}</dt>
              <dd className="mt-1.5 text-sm font-medium sm:text-base">
                {f.date ? <time dateTime={f.date}>{f.value}</time> : f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Result: horizontal stepper (desktop) / vertical timeline (mobile)   */
/* ================================================================== */

function Stepper({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const locale = intlLocale(useLang());
  return (
    <ol className="hidden grid-cols-7 lg:grid">
      {Array.from({ length: TRACKING_STEP_COUNT }, (_, i) => {
        const done = i < shipment.statusIndex;
        const current = i === shipment.statusIndex;
        const event = shipment.events.find((e) => e.step === i);
        const Icon = stepIcon(i, shipment.mode);
        return (
          <li key={i} aria-current={current ? "step" : undefined} className="relative flex flex-col items-center px-2 text-center">
            {i < TRACKING_STEP_COUNT - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 top-7 h-0.5 w-full",
                  done || current ? "bg-primary" : "bg-border",
                  current && "bg-gradient-to-r from-primary to-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-14 place-items-center rounded-full ring-8 ring-secondary transition-colors",
                done && "bg-charcoal text-white",
                current && "bg-primary text-white shadow-[0_12px_30px_-8px_rgba(200,16,46,0.7)]",
                !done && !current && "border-2 border-dashed border-grey-soft bg-white text-grey",
              )}
            >
              <Icon aria-hidden="true" className="size-6" />
              {done && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-white">
                  <Check aria-hidden="true" className="size-3" />
                </span>
              )}
              {current && (
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none [animation-duration:2.4s]" />
              )}
            </span>
            <p className={cn("mt-4 text-sm font-semibold", !done && !current && "text-muted-foreground")}>
              {t.tracking.steps[i]}
            </p>
            {event ? (
              <p className="mt-1 text-xs text-muted-foreground">
                <time dateTime={event.date}>{formatDate(event.date, locale)}</time>
                <br />
                {event.location}
              </p>
            ) : (
              <p className="mt-1 text-xs text-grey">—</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ================================================================== */
/* Result: history feed + documents                                    */
/* ================================================================== */

function History({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const events = [...shipment.events].reverse();
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-semibold">{t.tracking.eventsTitle}</h3>
      <Stagger as="ol" className="relative mt-6">
        <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-0.5 bg-border" />
        {events.map((ev, i) => (
          <StaggerItem as="li" key={`${ev.date}-${ev.step}`} className="relative pb-7 pl-9 last:pb-0">
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-1 size-4 rounded-full ring-4 ring-white",
                i === 0 ? "bg-primary" : "bg-charcoal/25",
              )}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className={cn("font-medium", i === 0 && "text-foreground")}>{ev.label[lang]}</p>
              <time dateTime={ev.date} className="font-mono text-xs text-muted-foreground">
                {formatDate(ev.date, locale)}
              </time>
            </div>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />
              {ev.location}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Documents({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="rounded-2xl bg-secondary p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold">{t.tracking.documentsTitle}</h3>
      <ul className="mt-6 grid grid-cols-2 gap-3">
        {shipment.documents.map((doc) => (
          <li
            key={doc.label}
            title={t.tracking.documentDemo}
            className={cn(
              "group relative flex flex-col rounded-xl bg-white p-4 shadow-card",
              !doc.available && "opacity-70",
            )}
          >
            <span className="flex items-start justify-between">
              <span className="relative grid h-12 w-10 place-items-center rounded-md border border-border bg-secondary">
                <FileText aria-hidden="true" className="size-5 text-primary" />
                <span className="absolute -bottom-1.5 -right-2 rounded bg-charcoal px-1 text-[0.55rem] font-bold uppercase text-white">
                  pdf
                </span>
              </span>
              {doc.available ? (
                <Download aria-hidden="true" className="size-4 text-muted-foreground" />
              ) : (
                <Lock aria-hidden="true" className="size-4 text-muted-foreground" />
              )}
            </span>
            <p className="mt-4 font-display font-semibold">{doc.label}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{doc.description[lang]}</p>
            <span
              className={cn(
                "mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold",
                doc.available ? "bg-charcoal text-white" : "border border-dashed border-grey text-muted-foreground",
              )}
            >
              {doc.available && <Check aria-hidden="true" className="size-3" />}
              {doc.available ? t.tracking.documentAvailable : t.tracking.documentPending}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock aria-hidden="true" className="size-3.5" />
        {t.tracking.documentDemo}
      </p>
    </div>
  );
}

function ShipmentView({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={shipment.reference}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ShipmentHeader shipment={shipment} />

      <div className="mt-8 rounded-3xl bg-secondary px-4 py-10 sm:px-8">
        <h3 className="mb-8 px-2 font-display text-xl font-semibold lg:text-center">{t.tracking.timelineTitle}</h3>
        <Stepper shipment={shipment} />
        <TrackingTimeline shipment={shipment} className="px-2 lg:hidden" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <History shipment={shipment} />
        <Documents shipment={shipment} />
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* Empty state + not found                                             */
/* ================================================================== */

function DemoCard({ shipment, onOpen }: { shipment: Shipment; onOpen: () => void }) {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const Icon = MODE_ICON[shipment.mode];
  const pct = Math.round(progressOf(shipment) * 100);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex w-full flex-col rounded-2xl border border-border bg-white p-6 text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary motion-reduce:hover:translate-y-0"
    >
      <CornerBrackets size="sm" className="absolute inset-3" />
      <span className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-charcoal text-white transition-colors group-hover:bg-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="font-mono text-lg font-bold tracking-wider">{shipment.reference}</span>
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {t.tracking.steps[shipment.statusIndex]}
        </span>
      </span>
      <span className="mt-6 flex items-center gap-3 font-display font-semibold">
        {splitPlace(shipment.route.from[lang])[0]}
        <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-grey" />
        <ArrowRight aria-hidden="true" className="size-4 text-primary" />
        {splitPlace(shipment.route.to[lang])[0]}
      </span>
      <span className="mt-5 block h-1.5 overflow-hidden rounded-full bg-secondary">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
      <span className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {t.tracking.progress} · {pct}%
        </span>
        <span>
          {t.tracking.eta} · <time dateTime={shipment.eta}>{formatDate(shipment.eta, locale)}</time>
        </span>
      </span>
    </button>
  );
}

function Journey() {
  const t = useT();
  return (
    <div>
      <SectionHeading align="center" eyebrow={t.tracking.journeyEyebrow} title={t.tracking.journeyTitle} text={t.tracking.journeyText} />
      <Stagger as="ol" className="relative mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:grid-cols-7">
        <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-8 hidden border-t-2 border-dashed border-primary/30 lg:block" />
        {Array.from({ length: TRACKING_STEP_COUNT }, (_, i) => {
          const Icon = stepIcon(i, "Maritime");
          return (
            <StaggerItem as="li" key={i} className="group relative flex flex-col items-center text-center">
              <span className="relative grid size-16 place-items-center rounded-2xl bg-white text-charcoal shadow-card ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-white motion-reduce:transform-none">
                <Icon aria-hidden="true" className="size-7" />
                <span className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full bg-charcoal font-mono text-[0.7rem] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <p className="mt-4 text-sm font-semibold">{t.tracking.steps[i]}</p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

function EmptyState({ onDemo }: { onDemo: (ref: string) => void }) {
  const t = useT();
  return (
    <>
      <Journey />
      <div className="mt-20">
        <Reveal>
          <h2 className="eyebrow text-primary">{t.tracking.demoTitle}</h2>
        </Reveal>
        <Stagger className="mt-6 grid gap-6 md:grid-cols-2">
          {shipments.map((s) => (
            <StaggerItem key={s.reference}>
              <DemoCard shipment={s} onOpen={() => onDemo(s.reference)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}

function NotFound({ reference, onDemo }: { reference: string; onDemo: (ref: string) => void }) {
  const t = useT();
  return (
    <Reveal className="group relative mx-auto max-w-2xl overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-center sm:px-12">
      <CornerBrackets className="absolute inset-4" />
      <span className="relative mx-auto grid size-20 place-items-center rounded-full bg-white shadow-card">
        <PackageSearch aria-hidden="true" className="size-9 text-primary" />
        <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 spin-slow" />
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold">{t.tracking.notFoundTitle}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t.tracking.notFoundText(reference)}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.tracking.tryDemo}
            {useLang() === "fr" ? " :" : ":"}</span>
        {shipments.map((s) => (
          <button
            key={s.reference}
            type="button"
            onClick={() => onDemo(s.reference)}
            className="rounded-full border border-border bg-white px-3 py-1.5 font-mono text-xs font-semibold tracking-wider transition-colors hover:border-primary hover:text-primary"
          >
            {s.reference}
          </button>
        ))}
      </div>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/contact">{t.tracking.contactUs}</Link>
      </Button>
    </Reveal>
  );
}

function ClientBand() {
  const t = useT();
  return (
    <Reveal className="group relative mt-20 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-border p-8 sm:flex-row sm:items-center sm:p-10">
      <CornerBrackets className="absolute inset-3" />
      <div className="flex items-start gap-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-charcoal text-white">
          <UserRound aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">{t.tracking.clientTitle}</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.tracking.clientText}</p>
        </div>
      </div>
      <Button asChild size="lg" className="shrink-0">
        <Link to="/espace-client">
          {t.tracking.clientCta} <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </Reveal>
  );
}

/* ================================================================== */

function SuiviPage() {
  const navigate = useNavigate({ from: "/suivi" });
  const { ref } = Route.useSearch();
  const [value, setValue] = useState(ref ?? "");

  useEffect(() => setValue(ref ?? ""), [ref]);

  const shipment = ref ? findShipment(ref) : undefined;
  const search = (reference: string) =>
    void navigate({
      search: (prev) => ({ ...prev, ref: normalizeReference(reference) || undefined }),
      resetScroll: false,
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(value);
  };

  return (
    <>
      <TrackingHero value={value} setValue={setValue} onSubmit={onSubmit} onDemo={search} />

      <section className="py-16 lg:py-24">
        <Container>
          <div aria-live="polite">
            {shipment ? (
              <ShipmentView shipment={shipment} />
            ) : ref ? (
              <NotFound reference={ref} onDemo={search} />
            ) : (
              <EmptyState onDemo={search} />
            )}
          </div>
          <ClientBand />
        </Container>
      </section>
    </>
  );
}