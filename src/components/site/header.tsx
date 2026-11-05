import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, Menu, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoAsset from "@/assets/alliance-logistics-logo.png";
import { site } from "@/config/site";
import { getServices } from "@/data/services";
import { useLang, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./lang-switch";
import { CornerBrackets, CrossroadsMotif } from "./motif";
import { ServiceIcon } from "./service-icon";
import { SiteImage } from "./site-image";

type NavKey = "about" | "network" | "tracking" | "news" | "contact";
const NAV: {
  key: NavKey;
  to: "/a-propos" | "/reseau" | "/suivi" | "/actualites" | "/contact";
  xlOnly?: boolean;
}[] = [
  { key: "about", to: "/a-propos" },
  { key: "network", to: "/reseau" },
  { key: "tracking", to: "/suivi", xlOnly: true },
  { key: "news", to: "/actualites" },
  { key: "contact", to: "/contact" },
];

const pad = (n: number) => String(n).padStart(2, "0");

function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  const t = useT();
  return (
    <Link
      to="/"
      title={t.a11y.homeAria}
      className={cn("group shrink-0", className)}
      {...(onClick ? { onClick } : {})}
    >
      <img
        src={logoAsset}
        alt={site.name}
        className="h-10 w-auto transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
        width={284}
        height={100}
      />
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

/** Red line under the active / hovered nav item, sliding between items. */
function NavIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      layoutId="nav-indicator"
      aria-hidden="true"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary"
    />
  );
}

export function Header() {
  const t = useT();
  const lang = useLang();
  const services = getServices(lang);
  const reduced = useReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [preview, setPreview] = useState(0);

  const megaId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // page scroll progress (thin red line under the header)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Close the mega menu on outside click.
  useEffect(() => {
    if (!megaOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!(e.target instanceof Node)) return;
      const inTrigger = itemRef.current?.contains(e.target) ?? false;
      const inPanel = panelRef.current?.contains(e.target) ?? false;
      if (!inTrigger && !inPanel) setMegaOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [megaOpen]);

  const hoverOpenedAt = useRef(0);
  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen((open) => {
      if (!open) hoverOpenedAt.current = Date.now();
      return true;
    });
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  }, []);

  const focusFirstPanelLink = () => {
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMegaOpen(true);
      focusFirstPanelLink();
    } else if (e.key === "Escape") {
      setMegaOpen(false);
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setMegaOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const links = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
      const index = links.findIndex((l) => l === document.activeElement);
      if (index === -1) return;
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? (index + 1) % links.length
          : (index - 1 + links.length) % links.length;
      links[next]?.focus();
    }
  };

  const servicesActive = isActive(pathname, "/services");
  const phone = site.contact.phones[0];
  const previewService = services[preview] ?? services[0];

  // which nav item shows the sliding indicator: hovered first, else active route
  const activeKey =
    NAV.find((n) => isActive(pathname, n.to))?.to ?? (servicesActive ? "/services" : null);
  const indicatorKey = hovered ?? activeKey;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || megaOpen
          ? "border-border/70 bg-white/90 shadow-[0_8px_30px_-18px_rgba(43,43,43,0.45)] backdrop-blur-xl"
          : "border-transparent bg-white",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t.a11y.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label={t.a11y.mainNav} className="hidden lg:block">
          <LayoutGroup id="main-nav">
            <ul className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
              <li
                ref={itemRef}
                className="relative"
                onMouseEnter={() => {
                  openMega();
                  setHovered("/services");
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls={megaId}
                  onClick={() =>
                    // A click right after the hover opened the panel must not close it again.
                    setMegaOpen((v) => (v && Date.now() - hoverOpenedAt.current < 500 ? true : !v))
                  }
                  onKeyDown={onTriggerKeyDown}
                  className={cn(
                    "relative inline-flex h-20 items-center gap-1 px-3 text-sm font-semibold transition-colors hover:text-foreground",
                    servicesActive || megaOpen ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t.nav.services}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-3.5 transition-transform duration-300", megaOpen && "rotate-180 text-primary")}
                  />
                  <NavIndicator show={!reduced && indicatorKey === "/services"} />
                </button>
              </li>
              {NAV.map((item) => {
                const active = isActive(pathname, item.to);
                return (
                  <li
                    key={item.to}
                    className={cn("relative", item.xlOnly && "hidden xl:block")}
                    onMouseEnter={() => setHovered(item.to)}
                  >
                    <Link
                      to={item.to}
                      className={cn(
                        "relative inline-flex h-20 items-center px-3 text-sm font-semibold transition-colors hover:text-foreground",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {t.nav[item.key]}
                      <NavIndicator show={!reduced && indicatorKey === item.to} />
                      {reduced && active && (
                        <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              aria-label={phone}
              title={phone}
              className="hidden size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary xl:grid"
            >
              <Phone aria-hidden="true" className="size-4" />
            </a>
          )}
          <LangSwitch />
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link to="/espace-client" aria-label={t.nav.clientArea}>
              <UserRound aria-hidden="true" className="size-4" />
              <span className="hidden xl:inline">{t.nav.clientArea}</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="group h-9 shadow-[0_8px_20px_-10px_rgba(200,16,46,0.8)]">
            <Link to="/cotation">
              {t.nav.quote}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch className="hidden sm:inline-flex" />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/cotation">{t.nav.quoteShort}</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t.a11y.openMenu}>
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[92vw] max-w-sm flex-col overflow-y-auto border-l-0 bg-charcoal p-0 text-white"
            >
              <SheetTitle className="sr-only">{t.a11y.mobileNav}</SheetTitle>
              <SheetDescription className="sr-only">{site.name}</SheetDescription>
              <div className="relative isolate overflow-hidden px-6 pb-8 pt-6">
                <CrossroadsMotif className="absolute -bottom-24 -right-24 -z-10 h-80 w-80 text-white/[0.05]" />
                <div className="inline-block rounded-lg bg-white p-2">
                  <Logo onClick={() => setMobileOpen(false)} />
                </div>

                <nav aria-label={t.a11y.mobileNav} className="mt-10 flex flex-col">
                  <Link
                    to="/"
                    className={cn(
                      "flex items-baseline gap-4 border-b border-white/10 py-3.5 font-display text-2xl font-bold",
                      pathname === "/" ? "text-primary" : "text-white",
                    )}
                  >
                    <span className="font-mono text-xs font-normal text-white/40">01</span>
                    {t.nav.home}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={mobileServicesOpen}
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-white/10 py-3.5 text-left font-display text-2xl font-bold",
                      servicesActive ? "text-primary" : "text-white",
                    )}
                  >
                    <span className="font-mono text-xs font-normal text-white/40">02</span>
                    <span className="flex-1">{t.nav.services}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn("size-5 self-center transition-transform", mobileServicesOpen && "rotate-180")}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <ul className="border-b border-white/10 py-2 pl-9">
                      <li>
                        <Link
                          to="/services"
                          className="block py-2 text-sm font-semibold text-primary"
                        >
                          {t.nav.megaAll}
                        </Link>
                      </li>
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to="/services/$slug"
                            params={{ slug: s.slug }}
                            className="flex items-center gap-3 py-2 text-sm text-white/80"
                          >
                            <ServiceIcon icon={s.icon} className="size-5 shrink-0 text-white/60" />
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {NAV.map((item, i) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-baseline gap-4 border-b border-white/10 py-3.5 font-display text-2xl font-bold",
                        isActive(pathname, item.to) ? "text-primary" : "text-white",
                      )}
                    >
                      <span className="font-mono text-xs font-normal text-white/40">{pad(i + 3)}</span>
                      {t.nav[item.key]}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 flex flex-col gap-3">
                  <Button asChild size="lg">
                    <Link to="/cotation">
                      {t.nav.quote} <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/espace-client">
                      <UserRound aria-hidden="true" className="size-4" /> {t.nav.clientArea}
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                  <LangSwitch />
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-sm text-white/70"
                    >
                      <Phone className="size-4 text-primary" aria-hidden="true" /> {phone}
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mega menu (full width, below the bar) */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            ref={panelRef}
            id={megaId}
            onKeyDown={onPanelKeyDown}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            onBlur={(e) => {
              const to = e.relatedTarget as Node | null;
              if (!itemRef.current?.contains(to) && !panelRef.current?.contains(to)) setMegaOpen(false);
            }}
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full hidden border-b border-border bg-white shadow-[0_40px_80px_-40px_rgba(43,43,43,0.45)] lg:block"
          >
            <div className="relative mx-auto grid max-w-7xl gap-6 overflow-hidden px-8 py-8 lg:grid-cols-[0.9fr_1.6fr_1fr]">
              <CrossroadsMotif className="absolute -bottom-24 left-1/3 h-72 w-72 motif-faint" />

              {/* Intro + quote card */}
              <div className="relative flex flex-col justify-between gap-6 rounded-2xl bg-charcoal p-6 text-white">
                <CornerBrackets tone="light" size="sm" className="absolute inset-2.5" />
                <div>
                  <p className="eyebrow text-white/60">{t.nav.megaTitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{t.nav.megaIntro}</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-white/60">
                    <Clock aria-hidden="true" className="size-3.5 text-primary" />
                    {site.stats.responseHours}h · {t.stats.response}
                  </p>
                  <p className="mt-3 font-display text-lg font-semibold">{t.nav.megaQuoteTitle}</p>
                  <p className="mt-1 text-sm text-white/75">{t.nav.megaQuoteText}</p>
                  <Link
                    to="/cotation"
                    className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t.nav.quote}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Services list */}
              <ul className="relative grid content-start gap-1">
                {services.map((s, i) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      onMouseEnter={() => setPreview(i)}
                      onFocus={() => setPreview(i)}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-xl px-4 py-3 outline-none transition-colors",
                        preview === i ? "bg-secondary" : "hover:bg-secondary",
                      )}
                    >
                      <span className="w-6 font-mono text-xs text-muted-foreground">{pad(i + 1)}</span>
                      <ServiceIcon
                        icon={s.icon}
                        className={cn(
                          "size-9 shrink-0 transition-colors duration-300",
                          preview === i ? "text-primary" : "text-charcoal",
                        )}
                      />
                      <span className="flex-1">
                        <span className="block font-display text-sm font-semibold text-foreground">
                          {s.title}
                        </span>
                        <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
                          {s.short}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 transition-all duration-300",
                          preview === i ? "rotate-45 text-primary opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-border pt-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {t.nav.megaAll} <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              </ul>

              {/* Live preview of the hovered service */}
              {previewService && (
                <div className="relative overflow-hidden rounded-2xl bg-charcoal">
                  {services.map((s, i) => (
                    <div
                      key={s.slug}
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 transition-all duration-500 ease-out",
                        i === preview ? "scale-100 opacity-100" : "scale-105 opacity-0",
                      )}
                    >
                      <SiteImage image={s.image} sizes="25vw" className="h-full w-full" />
                    </div>
                  ))}
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="font-mono text-xs text-white/60">
                      {pad(preview + 1)} / {pad(services.length)}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold leading-snug">
                      {previewService.title}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduced ? 0 : progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
      />
    </header>
  );
}