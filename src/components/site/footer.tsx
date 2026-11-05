import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Linkedin, Mail, MapPin, Phone, Plane, Ship, Truck } from "lucide-react";
import logoAsset from "@/assets/alliance-logistics-logo.png";
import { site } from "@/config/site";
import { getServices } from "@/data/services";
import { useLang, useT, type Lang } from "@/i18n";
import { cn } from "@/lib/utils";
import { CornerBrackets, CrossroadsMotif } from "./motif";

const COPY: Record<Lang, { localTime: string; backToTop: string }> = {
  fr: { localTime: "Heure à Casablanca", backToTop: "Retour en haut" },
  en: { localTime: "Casablanca time", backToTop: "Back to top" },
};

/** Decorative route line of cities (same list idea as the homepage marquee). */
const ROUTE = ["Casablanca", "Shanghai", "Rotterdam", "Dubaï", "Marseille", "Istanbul", "Dakar", "Montréal", "Santos", "Mumbai"];

function useCasablancaTime(locale: string) {
  // rendered client-side only to avoid SSR/hydration mismatch
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
      hourCycle: "h23",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);
  return time;
}

const linkClass = "group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white";

/** Red dash that draws in before a footer link on hover. */
function Dash() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4 motion-reduce:transition-none"
    />
  );
}

export function Footer() {
  const t = useT();
  const lang = useLang();
  const c = COPY[lang];
  const services = getServices(lang);
  const year = new Date().getFullYear();
  const time = useCasablancaTime(lang === "fr" ? "fr-MA" : "en-GB");

  const company = [
    { to: "/a-propos", label: t.nav.about },
    { to: "/reseau", label: t.nav.network },
    { to: "/actualites", label: t.nav.news },
    { to: "/cotation", label: t.nav.quote },
    { to: "/suivi", label: t.nav.tracking },
    { to: "/espace-client", label: t.nav.clientArea },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  const phone = site.contact.phones[0];
  const icons = [Ship, Plane, Truck];

  return (
    <footer className="relative isolate overflow-hidden bg-charcoal text-white">
      <CrossroadsMotif className="absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] text-white/[0.04]" />

      {/* Route strip */}
      <div aria-hidden="true" className="overflow-hidden border-b border-white/10 py-4">
        <div className="marquee flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex">
              {ROUTE.map((city, i) => {
                const Icon = icons[i % icons.length]!;
                return (
                  <span key={`${k}-${city}`} className="flex shrink-0 items-center gap-5 pr-5 text-white/40">
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.3em]">{city}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-px w-8 border-t border-dashed border-white/30" />
                      <Icon className="size-3.5 text-primary" />
                      <span className="h-px w-8 border-t border-dashed border-white/30" />
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Contact tiles */}
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {phone && (
            <li>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="group flex h-full items-center gap-4 bg-charcoal p-6 transition-colors hover:bg-[#333]"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:ring-primary">
                  <Phone aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="eyebrow block text-white/50">{t.contact.phone}</span>
                  <span className="mt-1 block font-display text-lg font-semibold">{phone}</span>
                </span>
              </a>
            </li>
          )}
          <li>
            <a
              href={`mailto:${site.contact.email}`}
              className="group flex h-full items-center gap-4 bg-charcoal p-6 transition-colors hover:bg-[#333]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:ring-primary">
                <Mail aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="eyebrow block text-white/50">{t.contact.email}</span>
                <span className="mt-1 block truncate font-display text-lg font-semibold">{site.contact.email}</span>
              </span>
            </a>
          </li>
          <li>
            <Link
              to="/contact"
              className="group flex h-full items-center gap-4 bg-charcoal p-6 transition-colors hover:bg-[#333]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:ring-primary">
                <MapPin aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-white/50">{t.contact.address}</span>
                <span className="mt-1 block text-sm leading-snug text-white/85">
                  {site.contact.addressLines.slice(-2).join(", ")}
                </span>
              </span>
              <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </li>
        </ul>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link to="/" title={t.a11y.homeAria} className="relative inline-block rounded-xl bg-white p-3">
            <img
              src={logoAsset}
              alt={site.name}
              className="h-9 w-auto"
              width={256}
              height={90}
              loading="lazy"
            />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">{t.footer.about}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={t.about.certifications.eyebrow}>
            {site.certifications.map((cert) => (
              <li
                key={cert.label}
                title={`${cert.detail} (${t.footer.certDemo})`}
                className="relative rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold tracking-[0.15em] text-white/85"
              >
                {cert.label}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t.footer.services}>
          <h2 className="eyebrow text-white/50">{t.footer.services}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className={linkClass}>
                  <Dash />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.company}>
          <h2 className="eyebrow text-white/50">{t.footer.company}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {company.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  <Dash />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-white/50">{t.footer.contact}</h2>
          <address className="mt-5 text-sm not-italic leading-relaxed text-white/75">
            {site.contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-4 space-y-2 text-sm">
            {site.contact.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="text-white/75 transition-colors hover:text-white">
                  {p}
                </a>
              </li>
            ))}
          </ul>

          {/* Casablanca live clock */}
          <div className="relative mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3">
            <CornerBrackets tone="light" size="sm" className="absolute inset-1" />
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-white/60">{c.localTime}</span>
            <span className="font-mono text-sm font-semibold tabular-nums" suppressHydrationWarning>
              {time ?? "--:--"}
            </span>
          </div>

          <div className="mt-5">
            <a
              href={site.social.linkedin}
              {...(site.social.linkedinPlaceholder ? {} : { target: "_blank", rel: "noreferrer" })}
              {...(site.social.linkedinPlaceholder ? { title: t.footer.linkedinPlaceholder } : {})}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Giant outlined wordmark */}
      <div aria-hidden="true" className="pointer-events-none relative select-none overflow-hidden px-4">
        <p className="-mb-[0.18em] text-center font-display text-[17vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]">
          ALLIANCE
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-charcoal">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to="/mentions-legales" className="hover:text-white">
                {t.footer.legal}
              </Link>
            </li>
            <li>
              <Link to="/politique-de-confidentialite" className="hover:text-white">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <p className="hidden lg:block">{t.footer.baseline}</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={c.backToTop}
              title={c.backToTop}
              className={cn(
                "group grid size-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              )}
            >
              <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}