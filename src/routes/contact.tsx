import { useEffect, useMemo, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import {
  ArrowRight,
  Briefcase,
  Calculator,
  Check,
  Clock,
  ExternalLink,
  FileCheck2,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  PackageSearch,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DarkHero } from "@/components/site/dark-hero";
import { FormField } from "@/components/site/form-field";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { TextureBackground } from "@/components/site/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Container } from "@/components/site/section";
import { site } from "@/config/site";
import { getDictionary, langFromSearch, useT } from "@/i18n";
import type { Dictionary } from "@/i18n/fr";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

const SUBJECTS = ["cotation", "douane", "suivi", "partenariat", "recrutement", "autre"] as const;
type Subject = (typeof SUBJECTS)[number];

const SUBJECT_ICON: Record<Subject, typeof Mail> = {
  cotation: Calculator,
  douane: FileCheck2,
  suivi: PackageSearch,
  partenariat: Handshake,
  recrutement: Briefcase,
  autre: MessageSquare,
};

export const Route = createFileRoute("/contact")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/contact",
      title: t.contact.seoTitle,
      description: t.contact.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.contact, path: "/contact" },
          ],
          lang,
        ),
      ],
    });
  },
  component: ContactPage,
});

function buildSchema(e: Dictionary["quote"]["errors"]) {
  return z.object({
    subject: z
      .union([z.enum(SUBJECTS), z.literal("")])
      .refine((v) => v !== "", { message: e.required }),
    name: z.string().trim().min(2, e.min(2)),
    company: z.string().trim(),
    email: z.string().trim().email(e.email),
    phone: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\+?[\d\s().-]{8,20}$/.test(v), e.phone),
    message: z.string().trim().min(10, e.min(10)),
    consent: z.boolean().refine((v) => v, { message: e.consent }),
  });
}

type ContactSchema = ReturnType<typeof buildSchema>;
type ContactValues = z.input<ContactSchema>;

/* ================================================================== */
/* Quick channels (overlap the hero)                                   */
/* ================================================================== */

function QuickChannels() {
  const t = useT();
  const phone = site.contact.phones[0] ?? "";
  const channels = [
    {
      Icon: Phone,
      title: t.contact.quick.call,
      value: phone,
      text: t.contact.quick.callText,
      href: `tel:${phone.replace(/\s/g, "")}`,
      external: false,
    },
    {
      Icon: Mail,
      title: t.contact.quick.write,
      value: site.contact.email,
      text: t.contact.quick.writeText,
      href: `mailto:${site.contact.email}`,
      external: false,
    },
    {
      Icon: MessageCircle,
      title: t.contact.quick.chat,
      value: site.whatsapp.display,
      text: t.contact.quick.chatText,
      href: `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(t.whatsapp.message)}`,
      external: true,
    },
  ];
  return (
    <div className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <Stagger className="grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 md:grid-cols-3">
          {channels.map(({ Icon, title, value, text, href, external }, i) => (
            <StaggerItem key={title} className={cn(i > 0 && "border-t border-border md:border-l md:border-t-0")}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group relative flex items-center gap-5 p-6 transition-colors hover:bg-secondary/60 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                />
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-charcoal text-white transition-colors duration-300 group-hover:bg-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block font-display text-base font-semibold [overflow-wrap:anywhere] lg:text-lg">{value}</span>
                  <span className="block text-sm text-muted-foreground">{text}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}

/* ================================================================== */
/* Map card (Google Maps loaded on demand)                             */
/* ================================================================== */

function MapCard() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal text-white shadow-card">
      {show ? (
        <iframe
          title={t.contact.mapTitle}
          src={site.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 -z-10 h-full w-full border-0 grayscale-[40%]"
        />
      ) : (
        <>
          <TextureBackground />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="relative grid size-14 place-items-center rounded-full bg-primary">
              <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-primary/50 motion-reduce:animate-none" />
              <MapPin aria-hidden="true" className="relative size-6" />
            </span>
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => setShow(true)}
            >
              {t.contact.mapLoad}
            </Button>
            <p className="text-xs text-white/60">{t.contact.mapConsent}</p>
          </div>
        </>
      )}
      {/* address tag */}
      <a
        href={site.mapsLinkUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl bg-white p-3 text-charcoal shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-white">
          <MapPin aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1 text-sm">
          <span className="block truncate font-semibold">{site.name} — Casablanca</span>
          <span className="block truncate text-xs text-muted-foreground">{site.contact.addressLines[0]}</span>
        </span>
        <ExternalLink aria-hidden="true" className="size-4 shrink-0 text-primary" />
        <span className="sr-only">{t.contact.directions}</span>
      </a>
    </div>
  );
}

/* ================================================================== */
/* Info card                                                           */
/* ================================================================== */

function InfoCard() {
  const t = useT();
  const rows = [
    {
      Icon: MapPin,
      label: t.contact.address,
      content: (
        <address className="not-italic">
          {site.contact.addressLines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </address>
      ),
    },
    {
      Icon: Phone,
      label: t.contact.phone,
      content: (
        <ul>
          {site.contact.phones.map((p) => (
            <li key={p}>
              <a href={`tel:${p.replace(/\s/g, "")}`} className="font-semibold text-white hover:text-primary">
                {p}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      Icon: Mail,
      label: t.contact.email,
      content: (
        <a href={`mailto:${site.contact.email}`} className="break-all font-semibold text-white hover:text-primary">
          {site.contact.email}
        </a>
      ),
    },
    { Icon: Clock, label: t.contact.hours, content: <p>{t.contact.hoursValue}</p> },
  ];
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-charcoal p-7 text-white sm:p-8">
      <CornerBrackets tone="light" className="absolute inset-3" />
      <CrossroadsMotif className="absolute -bottom-16 -right-16 h-56 w-56 text-white/[0.05]" />
      <h2 className="relative font-display text-xl font-bold">{t.contact.infoTitle}</h2>
      <ul className="relative mt-6 divide-y divide-white/10">
        {rows.map(({ Icon, label, content }) => (
          <li key={label} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
              <Icon aria-hidden="true" className="size-4 text-primary" />
            </span>
            <div className="text-sm leading-relaxed text-white/80">
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</p>
              {content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */

function ContactPage() {
  const t = useT();
  const reduced = useReducedMotion();
  const schema = useMemo(() => buildSchema(t.quote.errors), [t]);
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  const { register, control, handleSubmit, formState, reset } = useForm<
    ContactValues,
    unknown,
    z.output<ContactSchema>
  >({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { subject: "", name: "", company: "", email: "", phone: "", message: "", consent: false },
  });
  const errors = formState.errors;

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const onSubmit = handleSubmit(() => {
    // Frontend only: nothing is sent to a server in this version.
    setSent(true);
  });

  return (
    <>
      <DarkHero
        overlap
        eyebrow={t.contact.hero.eyebrow}
        title={t.contact.hero.title}
        text={t.contact.hero.text}
        crumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.contact }]}
      />
      <QuickChannels />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <Reveal className="group relative rounded-3xl border border-border bg-white p-6 shadow-card sm:p-10">
            <CornerBrackets className="absolute inset-3" />
            {sent ? (
              <div className="py-12 text-center" aria-live="polite">
                <motion.span
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-white shadow-[0_20px_40px_-12px_rgba(200,16,46,0.6)]"
                >
                  <Check aria-hidden="true" className="size-9" />
                </motion.span>
                <h2 ref={successRef} tabIndex={-1} className="mt-6 font-display text-3xl font-bold outline-none">
                  {t.contact.successTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t.contact.successText}</p>
                <p className="mx-auto mt-4 max-w-md text-xs text-muted-foreground">{t.contact.successNote}</p>
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => {
                    reset();
                    setSent(false);
                  }}
                >
                  {t.contact.successAgain}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <p className="eyebrow text-primary">{t.contact.hero.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-bold">{t.contact.formTitle}</h2>

                {/* subject tiles */}
                <Controller
                  control={control}
                  name="subject"
                  render={({ field }) => (
                    <fieldset className="mt-8">
                      <legend className="text-sm font-medium">
                        {t.contact.fields.subject}
                        <span className="text-primary" aria-hidden="true">
                          {" "}
                          *
                        </span>
                      </legend>
                      <div
                        role="radiogroup"
                        aria-describedby={errors.subject ? "c-subject-error" : undefined}
                        className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                      >
                        {SUBJECTS.map((s) => {
                          const Icon = SUBJECT_ICON[s];
                          const checked = field.value === s;
                          return (
                            <label
                              key={s}
                              className={cn(
                                "relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-3.5 text-sm font-medium transition-all sm:flex-row sm:items-center sm:gap-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                                checked
                                  ? "border-charcoal bg-charcoal text-white shadow-card"
                                  : "border-border bg-white hover:border-charcoal",
                              )}
                            >
                              <input
                                type="radio"
                                name="subject"
                                value={s}
                                checked={checked}
                                onChange={() => field.onChange(s)}
                                onBlur={field.onBlur}
                                className="sr-only"
                                aria-invalid={errors.subject ? true : undefined}
                              />
                              <span
                                className={cn(
                                  "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
                                  checked ? "bg-primary text-white" : "bg-secondary text-charcoal",
                                )}
                              >
                                <Icon aria-hidden="true" className="size-4" />
                              </span>
                              <span className="leading-tight">{t.contact.subjects[s]}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.subject && (
                        <p id="c-subject-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                          {errors.subject.message}
                        </p>
                      )}
                    </fieldset>
                  )}
                />

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <FormField id="c-name" label={t.contact.fields.name} required error={errors.name?.message}>
                    <Input className="h-12" autoComplete="name" {...register("name")} />
                  </FormField>
                  <FormField id="c-company" label={t.contact.fields.company} error={errors.company?.message}>
                    <Input className="h-12" autoComplete="organization" {...register("company")} />
                  </FormField>
                  <FormField id="c-email" label={t.contact.fields.email} required error={errors.email?.message}>
                    <Input type="email" className="h-12" autoComplete="email" {...register("email")} />
                  </FormField>
                  <FormField id="c-phone" label={t.contact.fields.phone} error={errors.phone?.message}>
                    <Input type="tel" className="h-12" autoComplete="tel" {...register("phone")} />
                  </FormField>
                  <FormField
                    id="c-message"
                    label={t.contact.fields.message}
                    required
                    error={errors.message?.message}
                    className="sm:col-span-2"
                  >
                    <Textarea rows={6} {...register("message")} />
                  </FormField>
                  <Controller
                    control={control}
                    name="consent"
                    render={({ field }) => (
                      <div className="sm:col-span-2">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-secondary p-4 text-sm">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={errors.consent ? "c-consent-error" : undefined}
                            className="mt-0.5"
                          />
                          <span>
                            {t.contact.fields.consent}{" "}
                            <Link to="/politique-de-confidentialite" className="font-semibold text-primary hover:underline">
                              {t.footer.privacy}
                            </Link>
                          </span>
                        </label>
                        {errors.consent && (
                          <p id="c-consent-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                            {errors.consent.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                  <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock aria-hidden="true" className="size-4 text-primary" />
                    {t.contact.quick.writeText}
                  </p>
                  <Button type="submit" size="lg">
                    <Send aria-hidden="true" /> {t.contact.submit}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <InfoCard />
            </Reveal>
            <Reveal delay={0.15}>
              <MapCard />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}