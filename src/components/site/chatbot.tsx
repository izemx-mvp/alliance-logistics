/**
 * Static scripted chatbot: no backend, no API.
 * Guided flows: quote qualification, customs info, dossier tracking, network, contact.
 * Place in: src/components/site/chatbot.tsx and mount it once in src/routes/__root.tsx.
 */
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileCheck2,
  MessageCircle,
  PackageSearch,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServices, type ServiceSlug } from "@/data/services";
import { useLang, type Lang } from "@/i18n";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* Copy (FR / EN)                                                      */
/* ================================================================== */

const COPY = {
  fr: {
    launcher: "Assistant Alliance",
    open: "Ouvrir l'assistant",
    close: "Fermer l'assistant",
    title: "Assistant Alliance",
    status: "Répond en quelques secondes",
    placeholder: "Écrivez votre message…",
    send: "Envoyer",
    restart: "Recommencer",
    demo: "Assistant automatique : pour un échange personnalisé, un conseiller vous répond sous 24h.",
    hello:
      "Bonjour 👋 Je suis l'assistant d'Alliance Logistics. Je peux vous aider à préparer une cotation, vous informer sur le dédouanement ou suivre un dossier. Que souhaitez-vous faire ?",
    menu: {
      quote: "Demander une cotation",
      customs: "Dédouaner une marchandise",
      track: "Suivre mon dossier",
      network: "Vos destinations",
      human: "Parler à un conseiller",
    },
    q: {
      service: "Très bien. Pour quel service ?",
      mode: "Quel mode de transport envisagez-vous ?",
      route: "D'où part la marchandise et où doit-elle arriver ? (ex. Shanghai → Casablanca)",
      load: "Quel volume approximatif ?",
      summary: "Parfait, voici le récapitulatif. Finalisez votre demande et un conseiller vous répond sous 24h maximum.",
      summaryTitle: "Votre besoin",
      finalize: "Finaliser ma demande",
    },
    modes: ["Maritime", "Aérien", "Routier", "À conseiller"],
    loads: ["Quelques colis / palettes", "Groupage (LCL)", "Conteneur 20'", "Conteneur 40'", "Camion complet", "Je ne sais pas"],
    labels: { service: "Service", mode: "Mode", route: "Trajet", load: "Volume" },
    customs:
      "Notre agence en douane, métier historique de la maison, prend en charge vos formalités import et export. En général, prévoyez :",
    customsDocs: ["Facture commerciale", "Liste de colisage", "Document de transport (BL, LTA, CMR)", "Certificats éventuels (origine, sanitaire…)"],
    customsMore: "Voir le service douane",
    trackAsk: "Indiquez votre numéro de dossier (ex. AL-2026-0142).",
    trackFound: (ref: string) => `Je retrouve le dossier ${ref}. Cliquez pour voir ses étapes et documents.`,
    trackCta: "Voir le suivi",
    trackInvalid: "Je n'ai pas reconnu ce numéro. Le format est AL-AAAA-NNNN, par exemple AL-2026-0142.",
    network:
      "Nous organisons vos flux sur tous les continents grâce à un réseau d'environ 600 agents partenaires, au départ et à destination de Casablanca.",
    networkCta: "Explorer le réseau",
    human: "Nos équipes vous répondent sous 24h maximum. Vous pouvez nous écrire ou nous appeler depuis la page contact.",
    humanCta: "Contacter l'équipe",
    price:
      "Chaque expédition est particulière (distance, poids, type de conteneur…), nos tarifs sont donc établis sur cotation. Je peux vous aider à la préparer.",
    fallback: "Je ne suis pas sûr de comprendre. Choisissez une option ci-dessous, ou un conseiller pourra vous répondre.",
    anythingElse: "Puis-je vous aider pour autre chose ?",
  },
  en: {
    launcher: "Alliance assistant",
    open: "Open the assistant",
    close: "Close the assistant",
    title: "Alliance assistant",
    status: "Replies in seconds",
    placeholder: "Type your message…",
    send: "Send",
    restart: "Start over",
    demo: "Automated assistant: for a personalised exchange, an advisor replies within 24h.",
    hello:
      "Hello 👋 I'm the Alliance Logistics assistant. I can help you prepare a quote, explain customs clearance or track a file. What would you like to do?",
    menu: {
      quote: "Request a quote",
      customs: "Clear goods through customs",
      track: "Track my file",
      network: "Your destinations",
      human: "Talk to an advisor",
    },
    q: {
      service: "Great. Which service?",
      mode: "Which transport mode are you considering?",
      route: "Where do the goods leave from and where should they arrive? (e.g. Shanghai → Casablanca)",
      load: "What is the approximate volume?",
      summary: "Perfect, here is the summary. Finalise your request and an advisor will reply within 24h.",
      summaryTitle: "Your need",
      finalize: "Finalise my request",
    },
    modes: ["Sea", "Air", "Road", "Advise me"],
    loads: ["A few parcels / pallets", "Groupage (LCL)", "20' container", "40' container", "Full truck", "I don't know"],
    labels: { service: "Service", mode: "Mode", route: "Route", load: "Volume" },
    customs:
      "Our customs agency, the company's historic business, handles your import and export formalities. You will usually need:",
    customsDocs: ["Commercial invoice", "Packing list", "Transport document (B/L, AWB, CMR)", "Any certificates (origin, sanitary…)"],
    customsMore: "See the customs service",
    trackAsk: "Enter your file number (e.g. AL-2026-0142).",
    trackFound: (ref: string) => `I found file ${ref}. Click to see its steps and documents.`,
    trackCta: "View tracking",
    trackInvalid: "I didn't recognise this number. The format is AL-YYYY-NNNN, for example AL-2026-0142.",
    network:
      "We organise your flows on every continent through a network of around 600 partner agents, to and from Casablanca.",
    networkCta: "Explore the network",
    human: "Our teams reply within 24h. You can write to us or call us from the contact page.",
    humanCta: "Contact the team",
    price:
      "Every shipment is different (distance, weight, container type…), so our rates are quoted case by case. I can help you prepare a request.",
    fallback: "I'm not sure I understand. Pick an option below, or an advisor can answer you.",
    anythingElse: "Can I help with anything else?",
  },
} satisfies Record<Lang, unknown>;

/* ================================================================== */
/* Types                                                               */
/* ================================================================== */

type Action =
  | { kind: "link-service"; slug: ServiceSlug; label: string }
  | { kind: "quote"; slug: ServiceSlug | null; label: string }
  | { kind: "track"; ref: string; label: string }
  | { kind: "link"; to: "/reseau" | "/contact"; label: string };

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  list?: string[];
  summary?: { label: string; value: string }[];
  action?: Action;
};

type Choice = { label: string; value: string };

type Flow =
  | { name: "menu" }
  | { name: "quote"; step: "service" | "mode" | "route" | "load"; data: QuoteData }
  | { name: "track" };

type QuoteData = { slug: ServiceSlug | null; service?: string; mode?: string; route?: string; load?: string };

const TRACK_RE = /AL-\d{4}-\d{4}/i;

/* ================================================================== */
/* Component                                                           */
/* ================================================================== */

export function Chatbot({ className }: { className?: string }) {
  const lang = useLang();
  const c = COPY[lang];
  const services = getServices(lang);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [flow, setFlow] = useState<Flow>({ name: "menu" });
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const menuChoices = (): Choice[] => [
    { label: c.menu.quote, value: "quote" },
    { label: c.menu.customs, value: "customs" },
    { label: c.menu.track, value: "track" },
    { label: c.menu.network, value: "network" },
    { label: c.menu.human, value: "human" },
  ];

  const push = (m: Omit<Msg, "id">) => setMsgs((prev) => [...prev, { ...m, id: ++idRef.current }]);

  /** Bot reply with a short typing delay. */
  const bot = (m: Omit<Msg, "id" | "from">, next: Choice[] = []) => {
    setChoices([]);
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        push({ ...m, from: "bot" });
        setChoices(next);
      },
      reduce ? 0 : 650,
    );
  };

  const start = () => {
    setMsgs([]);
    setFlow({ name: "menu" });
    bot({ text: c.hello }, menuChoices());
  };

  // greet on first open
  useEffect(() => {
    if (open && msgs.length === 0) start();
    if (open) window.setTimeout(() => inputRef.current?.focus(), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // reset greeting language when language changes
  useEffect(() => {
    if (msgs.length > 0) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, typing, choices, reduce]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ---------------- flows ---------------- */

  const startMenuItem = (value: string) => {
    switch (value) {
      case "quote":
        setFlow({ name: "quote", step: "service", data: { slug: null } });
        bot(
          { text: c.q.service },
          services.map((s) => ({ label: s.title, value: s.slug })),
        );
        return;
      case "customs":
        setFlow({ name: "menu" });
        bot(
          {
            text: c.customs,
            list: c.customsDocs,
            action: { kind: "link-service", slug: "agence-en-douane", label: c.customsMore },
          },
          menuChoices().filter((ch) => ch.value !== "customs"),
        );
        return;
      case "track":
        setFlow({ name: "track" });
        bot({ text: c.trackAsk });
        return;
      case "network":
        setFlow({ name: "menu" });
        bot({ text: c.network, action: { kind: "link", to: "/reseau", label: c.networkCta } }, menuChoices());
        return;
      case "human":
        setFlow({ name: "menu" });
        bot({ text: c.human, action: { kind: "link", to: "/contact", label: c.humanCta } }, menuChoices());
        return;
    }
  };

  const continueQuote = (step: "service" | "mode" | "route" | "load", data: QuoteData, answer: Choice) => {
    if (step === "service") {
      const slug = services.find((s) => s.slug === answer.value)?.slug ?? null;
      const next: QuoteData = { ...data, slug, service: answer.label };
      setFlow({ name: "quote", step: "mode", data: next });
      bot({ text: c.q.mode }, c.modes.map((m) => ({ label: m, value: m })));
      return;
    }
    if (step === "mode") {
      const next: QuoteData = { ...data, mode: answer.label };
      setFlow({ name: "quote", step: "route", data: next });
      bot({ text: c.q.route });
      return;
    }
    if (step === "route") {
      const next: QuoteData = { ...data, route: answer.label };
      setFlow({ name: "quote", step: "load", data: next });
      bot({ text: c.q.load }, c.loads.map((l) => ({ label: l, value: l })));
      return;
    }
    const done: QuoteData = { ...data, load: answer.label };
    setFlow({ name: "menu" });
    bot(
      {
        text: c.q.summary,
        summary: [
          { label: c.labels.service, value: done.service ?? "—" },
          { label: c.labels.mode, value: done.mode ?? "—" },
          { label: c.labels.route, value: done.route ?? "—" },
          { label: c.labels.load, value: done.load ?? "—" },
        ],
        action: { kind: "quote", slug: done.slug, label: c.q.finalize },
      },
      [{ label: c.restart, value: "__restart" }],
    );
  };

  /** Keyword routing for free text when no flow expects text. */
  const routeFreeText = (text: string) => {
    const s = text.toLowerCase();
    const ref = text.match(TRACK_RE)?.[0];
    if (ref) {
      const up = ref.toUpperCase();
      bot({ text: c.trackFound(up), action: { kind: "track", ref: up, label: c.trackCta } }, menuChoices());
      return;
    }
    if (/(cotation|devis|quote|quotation|exp[ée]di|envoyer|ship)/.test(s)) return startMenuItem("quote");
    if (/(douane|d[ée]douan|custom|dum|transit)/.test(s)) return startMenuItem("customs");
    if (/(suivi|suivre|track|dossier|file)/.test(s)) return startMenuItem("track");
    if (/(pays|destination|r[ée]seau|network|country|agent)/.test(s)) return startMenuItem("network");
    if (/(prix|tarif|co[uû]t|combien|price|rate|cost)/.test(s))
      return bot({ text: c.price }, [{ label: c.menu.quote, value: "quote" }, ...menuChoices().slice(1)]);
    if (/(conseiller|humain|appeler|t[ée]l[ée]phone|contact|advisor|human|call|phone)/.test(s))
      return startMenuItem("human");
    if (/^(bonjour|salut|salam|hello|hi|hey|bonsoir)\b/.test(s)) return bot({ text: c.hello }, menuChoices());
    bot({ text: c.fallback }, menuChoices());
  };

  const handleChoice = (choice: Choice) => {
    push({ from: "user", text: choice.label });
    if (choice.value === "__restart") return start();
    if (flow.name === "quote") return continueQuote(flow.step, flow.data, choice);
    startMenuItem(choice.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    push({ from: "user", text });

    if (flow.name === "quote" && flow.step === "route") {
      return continueQuote("route", flow.data, { label: text, value: text });
    }
    if (flow.name === "quote") {
      // free text while expecting a choice: accept it as the answer
      return continueQuote(flow.step, flow.data, { label: text, value: text });
    }
    if (flow.name === "track") {
      const ref = text.match(TRACK_RE)?.[0];
      if (ref) {
        const up = ref.toUpperCase();
        setFlow({ name: "menu" });
        return bot(
          { text: c.trackFound(up), action: { kind: "track", ref: up, label: c.trackCta } },
          menuChoices(),
        );
      }
      return bot({ text: c.trackInvalid });
    }
    routeFreeText(text);
  };

  const runAction = (a: Action) => {
    setOpen(false);
    if (a.kind === "quote") {
      if (a.slug) void navigate({ to: "/cotation", search: { service: a.slug } });
      else void navigate({ to: "/cotation" });
    } else if (a.kind === "track") {
      void navigate({ to: "/suivi", search: (prev) => ({ ...prev, ref: a.ref }) });
    } else if (a.kind === "link-service") {
      void navigate({ to: "/services/$slug", params: { slug: a.slug } });
    } else {
      void navigate({ to: a.to });
    }
  };

  /* ---------------- render ---------------- */

  return (
    <div className={cn("fixed bottom-24 right-4 z-50 sm:right-6", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-label={c.title}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white shadow-[0_30px_80px_-20px_rgba(43,43,43,0.45)] sm:absolute sm:inset-auto sm:bottom-[4.5rem] sm:right-0 sm:h-[36rem] sm:max-h-[calc(100vh-9rem)] sm:w-[24rem] sm:rounded-3xl sm:ring-1 sm:ring-border"
          >
            {/* header */}
            <div className="relative flex items-center gap-3 bg-charcoal/95 px-5 py-4 text-white backdrop-blur-md">
              <span className="relative grid size-10 place-items-center rounded-full bg-primary">
                <PackageSearch aria-hidden="true" className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-charcoal bg-emerald-400" />
              </span>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-white/60">{c.status}</p>
              </div>
              <button
                type="button"
                onClick={start}
                aria-label={c.restart}
                title={c.restart}
                className="grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label={c.close}
                className="grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto bg-secondary/60 px-4 py-5"
            >
              <p className="mx-auto max-w-[18rem] text-center text-[0.7rem] leading-relaxed text-muted-foreground">
                {c.demo}
              </p>
              {msgs.map((m) => (
                <Bubble key={m.id} from={m.from}>
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.list && (
                    <ul className="mt-2 space-y-1.5">
                      {m.list.map((li) => (
                        <li key={li} className="flex gap-2">
                          <FileCheck2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.summary && (
                    <dl className="mt-3 overflow-hidden rounded-xl border border-border bg-secondary">
                      {m.summary.map((row) => (
                        <div key={row.label} className="flex justify-between gap-3 border-b border-dashed border-border px-3 py-2 text-xs last:border-b-0">
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className="text-right font-semibold">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {m.action && (
                    <Button size="sm" className="mt-3 w-full" onClick={() => runAction(m.action!)}>
                      {m.action.label} <ArrowRight aria-hidden="true" className="size-4" />
                    </Button>
                  )}
                </Bubble>
              ))}

              {typing && (
                <Bubble from="bot">
                  <span className="flex gap-1 py-1" aria-label="…">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </span>
                </Bubble>
              )}

              {choices.length > 0 && !typing && (
                <div className="flex flex-wrap justify-end gap-2 pt-1">
                  {choices.map((ch) => (
                    <button
                      key={ch.value}
                      type="button"
                      onClick={() => handleChoice(ch)}
                      className="rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-white p-3">
              <label htmlFor={`${panelId}-input`} className="sr-only">
                {c.placeholder}
              </label>
              <input
                ref={inputRef}
                id={`${panelId}-input`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={c.placeholder}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" className="size-10 shrink-0 rounded-full" aria-label={c.send}>
                <Send aria-hidden="true" className="size-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? c.close : c.open}
        className={cn(
          "group relative flex h-14 items-center gap-2 rounded-full bg-charcoal pl-4 pr-5 text-white shadow-[0_16px_40px_-12px_rgba(43,43,43,0.6)] transition-all duration-300 hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
          open && "max-sm:hidden",
        )}
      >
        {!open && (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-white bg-primary" />
          </span>
        )}
        {open ? <X aria-hidden="true" className="size-5" /> : <MessageCircle aria-hidden="true" className="size-5" />}
        <span className="text-sm font-semibold">{c.launcher}</span>
      </button>
    </div>
  );
}

function Bubble({ from, children }: { from: "bot" | "user"; children: ReactNode }) {
  return (
    <div className={cn("flex", from === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-in fade-in-0 slide-in-from-bottom-1 duration-300",
          from === "user"
            ? "rounded-br-md bg-charcoal text-white"
            : "rounded-bl-md bg-white text-foreground shadow-sm ring-1 ring-border",
        )}
      >
        {children}
      </div>
    </div>
  );
}