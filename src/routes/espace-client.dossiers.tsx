import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  FileText,
  Info,
  Lock,
  LogOut,
  MapPin,
  PackageCheck,
  Plane,
  Plus,
  Ship,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { TextureBackground } from "@/components/site/page-hero";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container } from "@/components/site/section";
import { formatDate } from "@/components/site/tracking-timeline";
import { TRACKING_STEP_COUNT, shipments, type Shipment, type ShipmentMode } from "@/data/shipments";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { signOutDemo, useDemoSession } from "@/lib/demo-session";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace-client/dossiers")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/espace-client/dossiers",
      title: t.client.dossiers.seoTitle,
      description: t.client.seoDescription,
      noindex: true,
    });
  },
  component: DossiersPage,
});

const MODE_ICON: Record<ShipmentMode, typeof Ship> = { Maritime: Ship, Aérien: Plane, Routier: Truck };

function progressOf(s: Shipment) {
  return Math.round((s.statusIndex / (TRACKING_STEP_COUNT - 1)) * 100);
}

/** "karim.benali@x.ma" → "Karim Benali" */
function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/* ================================================================== */

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const d = t.client.dossiers;
  const Icon = MODE_ICON[shipment.mode];
  const pct = progressOf(shipment);
  const docs = shipment.documents.filter((x) => x.available).length;
  const [from] = shipment.route.from[lang].split(",");
  const [to] = shipment.route.to[lang].split(",");

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)] sm:p-7">
      <CornerBrackets size="sm" className="absolute inset-3" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-charcoal text-white transition-colors group-hover:bg-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="font-mono text-lg font-bold tracking-wider">{shipment.reference}</h3>
            <p className="text-xs text-muted-foreground">
              {t.tracking.modes[shipment.mode]} · {shipment.incoterm}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
          {t.tracking.steps[shipment.statusIndex]}
        </span>
      </div>

      {/* route + progress */}
      <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <p className="font-display font-semibold">{from}</p>
        <div aria-hidden="true" className="relative h-8">
          <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-border" />
          <span className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary" style={{ width: `${pct}%` }} />
          <span
            className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-white shadow-[0_0_0_5px_rgba(200,16,46,0.15)]"
            style={{ left: `${pct}%` }}
          >
            <Icon className="size-4" />
          </span>
        </div>
        <p className="text-right font-display font-semibold">{to}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{shipment.goods[lang]}</p>

      <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border text-xs sm:text-sm">
        <div className="bg-secondary p-3">
          <dt className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.16em]">{t.tracking.progress}</dt>
          <dd className="mt-0.5 font-mono font-semibold">{pct}%</dd>
        </div>
        <div className="bg-secondary p-3">
          <dt className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.16em]">{d.eta}</dt>
          <dd className="mt-0.5 font-semibold">
            <time dateTime={shipment.eta}>{formatDate(shipment.eta, locale)}</time>
          </dd>
        </div>
        <div className="bg-secondary p-3">
          <dt className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.16em]">{t.tracking.documentsTitle}</dt>
          <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold">
            <FileText aria-hidden="true" className="size-3.5 text-primary" />
            {docs}/{shipment.documents.length}
          </dd>
        </div>
      </dl>

      <Link
        to="/suivi"
        search={(prev) => ({ ...prev, ref: shipment.reference })}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary before:absolute before:inset-0 before:content-[''] hover:underline"
      >
        {d.open} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        <span className="sr-only">{shipment.reference}</span>
      </Link>
    </article>
  );
}

function ActivityFeed() {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const events = shipments
    .flatMap((s) => s.events.map((e) => ({ ...e, ref: s.reference, mode: s.mode })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <Activity aria-hidden="true" className="size-5 text-primary" />
        {t.client.dossiers.activity}
      </h2>
      <ol className="relative mt-6">
        <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-border" />
        {events.map((ev, i) => (
          <li key={`${ev.ref}-${ev.date}-${ev.step}`} className="relative pb-6 pl-8 last:pb-0">
            <span
              aria-hidden="true"
              className={cn("absolute left-0 top-1 size-4 rounded-full ring-4 ring-white", i === 0 ? "bg-primary" : "bg-charcoal/20")}
            />
            <p className="text-sm font-medium leading-snug">{ev.label[lang]}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{ev.ref}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={ev.date}>{formatDate(ev.date, locale)}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3" />
                {ev.location}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ================================================================== */

function DossiersPage() {
  const t = useT();
  const lang = useLang();
  const locale = intlLocale(lang);
  const navigate = useNavigate();
  const email = useDemoSession();
  const d = t.client.dossiers;

  if (email === undefined) {
    return <div className="min-h-[60vh] pt-28" aria-busy="true" />;
  }

  if (email === null) {
    return (
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-secondary pb-16 pt-32">
        <CrossroadsMotif className="absolute -left-24 -top-10 -z-10 h-96 w-96 motif-faint" />
        <Container className="max-w-lg">
          <div className="group relative rounded-3xl bg-white p-10 text-center shadow-card">
            <CornerBrackets className="absolute inset-3" />
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-charcoal text-white">
              <Lock aria-hidden="true" className="size-7" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-bold">{d.loggedOutTitle}</h1>
            <p className="mt-3 text-muted-foreground">{d.loggedOutText}</p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/espace-client">
                {d.loggedOutCta} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const name = nameFromEmail(email);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  const active = shipments.filter((s) => s.statusIndex < TRACKING_STEP_COUNT - 1).length;
  const arrived = shipments.filter((s) => s.statusIndex >= 3).length;
  const docs = shipments.reduce((n, s) => n + s.documents.filter((x) => x.available).length, 0);
  const next = [...shipments].sort((a, b) => a.eta.localeCompare(b.eta))[0];

  const kpis = [
    { label: d.kpis.active, value: active, Icon: Ship },
    { label: d.kpis.arrived, value: arrived, Icon: PackageCheck },
    { label: d.kpis.docs, value: docs, Icon: FileText },
  ];

  return (
    <>
      {/* header band */}
      <section className="relative isolate overflow-hidden bg-charcoal text-white">
        <TextureBackground />
        <CrossroadsMotif className="absolute -right-20 -top-20 -z-10 h-80 w-80 text-white/[0.05]" />
        <Container className="flex flex-col justify-between gap-6 pb-32 pt-32 sm:flex-row sm:items-end lg:pt-36">
          <div className="hero-in flex items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary font-display text-2xl font-bold shadow-[0_16px_40px_-12px_rgba(200,16,46,0.7)]">
              {initials}
            </span>
            <div>
              <p className="eyebrow text-white/70">{t.client.eyebrow}</p>
              <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{d.hello(name)}</h1>
              <p className="mt-1 text-sm text-white/60">{d.welcome(email)}</p>
            </div>
          </div>
          <div className="hero-in flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/cotation">
                <Plus aria-hidden="true" /> {d.newQuote}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                signOutDemo();
                void navigate({ to: "/espace-client" });
              }}
            >
              <LogOut aria-hidden="true" /> {d.logout}
            </Button>
          </div>
        </Container>
      </section>

      {/* KPIs */}
      <div className="relative z-10 -mt-20">
        <Container>
          <Stagger className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 lg:grid-cols-4">
            {kpis.map(({ label, value, Icon }, i) => (
              <StaggerItem
                key={label}
                className={cn("p-5 sm:p-7", i % 2 === 1 && "border-l border-border", i >= 2 && "border-t border-border lg:border-t-0", i === 2 && "lg:border-l")}
              >
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-3 font-display text-4xl font-bold leading-none">
                  <CountUp value={value} locale={locale} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </StaggerItem>
            ))}
            {next && (
              <StaggerItem className="border-t border-l border-border bg-charcoal p-5 text-white sm:p-7 lg:border-t-0">
                <CalendarClock aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-3 font-display text-2xl font-bold leading-none sm:text-3xl">
                  <time dateTime={next.eta}>{formatDate(next.eta, locale)}</time>
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {d.kpis.nextEta} · <span className="font-mono">{next.reference}</span>
                </p>
              </StaggerItem>
            )}
          </Stagger>
        </Container>
      </div>

      <section className="bg-secondary pb-20 pt-14 lg:pt-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-bold">{d.shipmentsTitle}</h2>
                <p className="font-mono text-xs text-muted-foreground">{shipments.length}</p>
              </div>
              <Stagger className="mt-6 space-y-6">
                {shipments.map((s) => (
                  <StaggerItem key={s.reference}>
                    <ShipmentCard shipment={s} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
              <ActivityFeed />
            </Reveal>
          </div>
          <p className="mt-10 flex gap-2.5 text-sm text-muted-foreground">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /> {d.demoNote}
          </p>
        </Container>
      </section>
    </>
  );
}