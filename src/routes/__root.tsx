import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  retainSearchParams,
  useNavigate,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CrossroadsMotif } from "@/components/site/motif";
import { WorldMap } from "@/components/site/world-map";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import {
  LANG_STORAGE_KEY,
  getDictionary,
  langFromSearch,
  useLang,
  useT,
  validateLangSearch,
} from "@/i18n";
import { OG_IMAGE, jsonLdScripts, organizationLd } from "@/lib/seo";
import { Chatbot } from "@/components/site/chatbot";

function NotFoundComponent() {
  const t = useT();
  const links = [
    { to: "/services", label: t.nav.services },
    { to: "/cotation", label: t.nav.quote },
    { to: "/suivi", label: t.nav.tracking },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      <CrossroadsMotif className="absolute -right-24 -top-10 -z-10 h-[28rem] w-[28rem] motif-faint" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-36 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-44">
        <div>
          <p className="eyebrow text-primary">{t.notFound.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-balance sm:text-5xl">
            {t.notFound.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">{t.notFound.text}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={t.notFound.links}>
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/">
              {t.notFound.home} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[9rem] font-bold leading-none text-charcoal/[0.06] sm:text-[12rem]"
          >
            404
          </p>
          <WorldMap />
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const t = useT();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 pb-20 pt-32">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {t.error.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.error.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {t.error.retry}
          </Button>
          <Button asChild variant="outline">
            <a href="/">{t.error.home}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  validateSearch: validateLangSearch,
  search: { middlewares: [retainSearchParams(["lang"])] },
  head: ({ match }) => {
    const dict = getDictionary(langFromSearch(match.search));
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#2B2B2B" },
        { name: "author", content: site.name },
        { name: "format-detection", content: "telephone=no" },
        // Defaults; every route overrides title/description/OG with its own values.
        { title: dict.meta.siteTitle },
        { name: "description", content: dict.meta.defaultDescription },
        { property: "og:site_name", content: site.name },
        { property: "og:image", content: `${site.url}${OG_IMAGE.path}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `${site.url}${OG_IMAGE.path}` },
      ],
      scripts: jsonLdScripts([organizationLd()]),
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = useLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Restores the persisted language on a fresh visit without ?lang. */
function useRestoreLang() {
  const navigate = useNavigate();
  const lang = useLang();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "en" && lang === "fr" && !window.location.search.includes("lang=")) {
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => ({ ...prev, lang: "en" as const }),
        replace: true,
        resetScroll: false,
      });
    }
  }, [lang, navigate]);
}

function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={first.current || reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useRestoreLang();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <PageTransition>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </QueryClientProvider>
  );
}
