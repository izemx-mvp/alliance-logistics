import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  Check,
  Copy,
  Layers,
  Lightbulb,
  MapPin,
  Pencil,
  Phone,
  Plane,
  Ship,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DarkHero } from "@/components/site/dark-hero";
import { FieldGroup, FormField, controlProps } from "@/components/site/form-field";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { Container } from "@/components/site/section";
import { ServiceIcon } from "@/components/site/service-icon";
import { site } from "@/config/site";
import {
  SERVICE_SLUGS,
  getService,
  getServices,
  isServiceSlug,
  type ServiceSlug,
} from "@/data/services";
import { generateReference } from "@/data/shipments";
import { getDictionary, langFromSearch, useLang, useT } from "@/i18n";
import type { Dictionary } from "@/i18n/fr";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

const MODES = ["maritime", "aerien", "routier", "multimodal", "conseil"] as const;
const FLOWS = ["import", "export", "national"] as const;
const INCOTERMS = [
  "EXW",
  "FCA",
  "FAS",
  "FOB",
  "CFR",
  "CIF",
  "CPT",
  "CIP",
  "DAP",
  "DPU",
  "DDP",
  "unknown",
] as const;
const CONTAINERS = ["c20", "c40", "c40hc", "reefer", "lcl", "air", "truck", "na"] as const;

type Mode = (typeof MODES)[number];
type Flow = (typeof FLOWS)[number];

const MODE_ICON: Record<Mode, typeof Ship> = {
  maritime: Ship,
  aerien: Plane,
  routier: Truck,
  multimodal: Layers,
  conseil: Lightbulb,
};
const FLOW_ICON: Record<Flow, typeof Ship> = {
  import: ArrowDownToLine,
  export: ArrowUpFromLine,
  national: MapPin,
};

type CotationSearch = { service?: ServiceSlug | undefined; mode?: Mode | undefined };

export const Route = createFileRoute("/cotation")({
  validateSearch: (search: Record<string, unknown>): CotationSearch => {
    const out: CotationSearch = {};
    if (isServiceSlug(search["service"])) out.service = search["service"];
    const mode = search["mode"];
    if (typeof mode === "string" && (MODES as readonly string[]).includes(mode))
      out.mode = mode as Mode;
    return out;
  },
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/cotation",
      title: t.quote.seoTitle,
      description: t.quote.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.quote, path: "/cotation" },
          ],
          lang,
        ),
      ],
    });
  },
  component: CotationPage,
});

/* ------------------------------ Zod, per step ----------------------------- */

const optionalPositive = (msg: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+([.,]\d+)?$/.test(v) && Number(v.replace(",", ".")) > 0), msg);

/** Enum that is empty ("") until the user picks a value; "" fails validation. */
function requiredChoice<T extends string>(values: readonly [T, ...T[]], message: string) {
  return z.union([z.enum(values), z.literal("")]).refine((v) => v !== "", { message });
}

function buildSchemas(e: Dictionary["quote"]["errors"]) {
  const step1 = z.object({
    service: requiredChoice(SERVICE_SLUGS, e.required),
    mode: requiredChoice(MODES, e.required),
    flow: requiredChoice(FLOWS, e.required),
  });
  const step2 = z.object({
    origin: z.string().trim().min(2, e.min(2)),
    destination: z.string().trim().min(2, e.min(2)),
    incoterm: requiredChoice(INCOTERMS, e.required),
    goods: z.string().trim().min(3, e.min(3)),
    weight: optionalPositive(e.number),
    volume: optionalPositive(e.number),
    packages: optionalPositive(e.number),
    container: z.enum(CONTAINERS).optional(),
    dangerous: z.boolean(),
    temperature: z.boolean(),
    readyDate: z.string(),
  });
  const step3 = z.object({
    fullName: z.string().trim().min(2, e.min(2)),
    company: z.string().trim().min(2, e.min(2)),
    email: z.string().trim().email(e.email),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s().-]{8,20}$/, e.phone),
    message: z.string().max(2000),
  });
  const step4 = z.object({
    consent: z.boolean().refine((v) => v, { message: e.consent }),
  });
  return {
    steps: [step1, step2, step3, step4] as const,
    full: step1.merge(step2).merge(step3).merge(step4),
  };
}

type QuoteSchema = ReturnType<typeof buildSchemas>["full"];
type QuoteValues = z.input<QuoteSchema>;

const STEP_FIELDS: FieldPath<QuoteValues>[][] = [
  ["service", "mode", "flow"],
  [
    "origin",
    "destination",
    "incoterm",
    "goods",
    "weight",
    "volume",
    "packages",
    "container",
    "dangerous",
    "temperature",
    "readyDate",
  ],
  ["fullName", "company", "email", "phone", "message"],
  ["consent"],
];

/* --------------------------------- UI bits -------------------------------- */

/** Radio group rendered as icon tiles. */
function TileGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
}: {
  name: string;
  legend: string;
  options: { value: T; label: string; Icon: typeof Ship }[];
  value: string;
  onChange: (v: T) => void;
  error?: string | undefined;
  columns?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <FieldGroup legend={legend}>
      <div role="radiogroup" aria-describedby={error ? errorId : undefined} className={cn("grid gap-2.5", columns)}>
        {options.map(({ value: v, label, Icon }) => {
          const checked = value === v;
          return (
            <label
              key={v}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border px-3 py-4 text-center text-sm font-medium transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                checked
                  ? "border-charcoal bg-charcoal text-white shadow-card"
                  : "border-border bg-white hover:-translate-y-0.5 hover:border-charcoal motion-reduce:hover:translate-y-0",
              )}
            >
              <input
                type="radio"
                name={name}
                value={v}
                checked={checked}
                onChange={() => onChange(v)}
                className="sr-only"
                aria-invalid={error ? true : undefined}
              />
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-lg transition-colors",
                  checked ? "bg-primary text-white" : "bg-secondary text-charcoal group-hover:text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              {label}
              {checked && (
                <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-primary">
                  <Check aria-hidden="true" className="size-2.5" />
                </span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </FieldGroup>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="break-words font-medium">{value}</dd>
    </div>
  );
}

function LiveRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{children}</dd>
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function CotationPage() {
  const t = useT();
  const lang = useLang();
  const reduced = useReducedMotion();
  const search = Route.useSearch();
  const services = getServices(lang);
  const schemas = useMemo(() => buildSchemas(t.quote.errors), [t]);

  const prefillService = search.service;
  const prefillMode =
    search.mode ?? (prefillService ? getService(prefillService)?.ctaPrefill.mode : undefined);

  const form = useForm<QuoteValues, unknown, z.output<QuoteSchema>>({
    resolver: zodResolver(schemas.full),
    mode: "onTouched",
    defaultValues: {
      service: prefillService ?? "",
      mode: (prefillMode as Mode | undefined) ?? "",
      flow: "",
      origin: "",
      destination: "",
      incoterm: "",
      goods: "",
      weight: "",
      volume: "",
      packages: "",
      container: undefined,
      dangerous: false,
      temperature: prefillService === "transport-frigorifique",
      readyDate: "",
      fullName: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });
  const { register, control, handleSubmit, trigger, getValues, setValue, watch, formState, reset } =
    form;
  const errors = formState.errors;

  const [step, setStep] = useState(0);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const pendingFocus = useRef(false);

  // Keep prefill in sync when navigating between services with ?service=.
  useEffect(() => {
    if (prefillService) setValue("service", prefillService);
  }, [prefillService, setValue]);

  // Move focus to the new step heading once it mounts (after the exit animation).
  const focusHeading = useCallback((el: HTMLHeadingElement | null) => {
    headingRef.current = el;
    if (el && pendingFocus.current) {
      pendingFocus.current = false;
      el.focus();
    }
  }, []);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    pendingFocus.current = true;
    headingRef.current?.focus();
  }, [step, reference]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const total = t.quote.steps.length;
  const progress = reference ? 100 : ((step + 1) / total) * 100;

  const next = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    // Validate the current step against its own schema (zod per step).
    const stepSchema = schemas.steps[step];
    const ok = await trigger(fields, { shouldFocus: true });
    if (ok && stepSchema?.safeParse(getValues()).success !== false)
      setStep((s) => Math.min(s + 1, total - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = handleSubmit(() => {
    // Frontend only: no backend call. The reference is generated locally for the demo.
    setReference(generateReference());
  });

  const values = watch();
  const selectedService = services.find((s) => s.slug === values.service);
  const serviceTitle = selectedService?.title ?? "";
  const yesNo = (b: boolean) => (b ? t.common.yes : t.common.no);
  const hasLive = Boolean(values.service || values.mode || values.flow || values.origin || values.destination || values.goods);

  const stepVariants = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <>
      <DarkHero
        eyebrow={t.quote.hero.eyebrow}
        title={t.quote.hero.title}
        text={t.quote.hero.text}
        crumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.quote }]}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {t.quote.heroChips.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/15 backdrop-blur-sm"
            >
              <Check aria-hidden="true" className="size-3.5 text-primary" />
              {c}
            </li>
          ))}
        </ul>
      </DarkHero>

      <section className="bg-secondary py-16 lg:py-24">
        <Container className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr] lg:gap-10">
          <div className="group relative rounded-3xl bg-white p-6 shadow-card sm:p-10">
            <CornerBrackets className="absolute inset-3" />

            {/* Stepper */}
            <div>
              <ol className="grid grid-cols-4 gap-2">
                {t.quote.steps.map((label, i) => {
                  const done = Boolean(reference) || i < step;
                  const current = !reference && i === step;
                  return (
                    <li key={label} aria-current={current ? "step" : undefined} className="relative">
                      <button
                        type="button"
                        disabled={!done || Boolean(reference)}
                        onClick={() => setStep(i)}
                        className="flex w-full flex-col items-start gap-2 text-left disabled:cursor-default"
                      >
                        <span
                          className={cn(
                            "h-1.5 w-full rounded-full transition-colors duration-500",
                            done ? "bg-primary" : current ? "bg-charcoal" : "bg-secondary",
                          )}
                        />
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold",
                              done && "bg-primary text-white",
                              current && "bg-charcoal text-white",
                              !done && !current && "bg-secondary text-muted-foreground",
                            )}
                          >
                            {done ? <Check aria-hidden="true" className="size-3.5" /> : i + 1}
                          </span>
                          <span
                            className={cn(
                              "hidden text-sm font-semibold sm:inline",
                              !done && !current && "text-muted-foreground",
                            )}
                          >
                            {label}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="sr-only" role="status">
                {reference ? t.quote.successTitle : t.quote.stepOf(step + 1, total)} — {Math.round(progress)}%
              </p>
            </div>

            {reference ? (
              <div className="mt-12 text-center" aria-live="polite">
                <motion.span
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-white shadow-[0_20px_40px_-12px_rgba(200,16,46,0.6)]"
                >
                  <Check aria-hidden="true" className="size-9" />
                </motion.span>
                <h2 ref={focusHeading} tabIndex={-1} className="mt-6 font-display text-3xl font-bold outline-none sm:text-4xl">
                  {t.quote.successTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t.quote.successText}</p>

                {/* ticket */}
                <div className="relative mx-auto mt-10 max-w-md overflow-hidden rounded-2xl bg-charcoal text-left text-white">
                  <CrossroadsMotif className="absolute -right-10 -top-10 h-40 w-40 text-white/[0.05]" />
                  <div className="relative p-6">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                      {t.quote.successRef}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="font-mono text-3xl font-bold tracking-wider">{reference}</p>
                      <button
                        type="button"
                        onClick={() => void navigator.clipboard?.writeText(reference).then(() => setCopied(true))}
                        className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                        aria-label={copied ? t.news.copied : t.news.copyLink}
                      >
                        {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative border-t-2 border-dashed border-white/15 px-6 py-4 text-sm text-white/70">
                    <span aria-hidden="true" className="absolute -left-3 -top-3 size-6 rounded-full bg-white" />
                    <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 rounded-full bg-white" />
                    {serviceTitle}
                    {values.origin && values.destination && (
                      <span className="block text-white">
                        {values.origin} → {values.destination}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">{t.quote.successNote}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      reset();
                      setReference(null);
                      setStep(0);
                    }}
                  >
                    {t.quote.successAgain}
                  </Button>
                  <Button asChild>
                    <Link to="/">{t.quote.successHome}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={stepVariants.initial}
                    animate={stepVariants.animate}
                    exit={stepVariants.exit}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-mono text-xs font-bold text-primary">
                      {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </p>
                    <h2 ref={focusHeading} tabIndex={-1} className="mt-1 font-display text-3xl font-bold outline-none">
                      {t.quote.steps[step]}
                    </h2>

                    {step === 0 && (
                      <div className="mt-8 space-y-8">
                        <Controller
                          control={control}
                          name="service"
                          render={({ field }) => (
                            <FieldGroup legend={t.quote.fields.service}>
                              <div
                                role="radiogroup"
                                aria-describedby={errors.service ? "service-error" : undefined}
                                className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
                              >
                                {services.map((s) => {
                                  const checked = field.value === s.slug;
                                  return (
                                    <label
                                      key={s.slug}
                                      className={cn(
                                        "relative flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                                        checked
                                          ? "border-charcoal bg-charcoal text-white shadow-card"
                                          : "border-border bg-white hover:border-charcoal",
                                      )}
                                    >
                                      <input
                                        type="radio"
                                        name="service"
                                        value={s.slug}
                                        checked={checked}
                                        onChange={() => field.onChange(s.slug)}
                                        className="sr-only"
                                        aria-invalid={errors.service ? true : undefined}
                                      />
                                      <span
                                        className={cn(
                                          "grid size-11 shrink-0 place-items-center rounded-lg",
                                          checked ? "bg-white/10" : "bg-secondary",
                                        )}
                                      >
                                        <ServiceIcon icon={s.icon} className={cn("size-8", checked ? "text-white" : "text-charcoal")} />
                                      </span>
                                      <span className="font-semibold leading-snug">{s.title}</span>
                                      {checked && (
                                        <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-primary">
                                          <Check aria-hidden="true" className="size-2.5" />
                                        </span>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                              {errors.service && (
                                <p id="service-error" role="alert" className="text-sm font-medium text-destructive">
                                  {errors.service.message}
                                </p>
                              )}
                            </FieldGroup>
                          )}
                        />
                        <Controller
                          control={control}
                          name="mode"
                          render={({ field }) => (
                            <TileGroup
                              name="mode"
                              legend={t.quote.fields.mode}
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.mode?.message}
                              options={MODES.map((m) => ({ value: m, label: t.quote.modes[m], Icon: MODE_ICON[m] }))}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="flow"
                          render={({ field }) => (
                            <TileGroup
                              name="flow"
                              legend={t.quote.fields.flow}
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.flow?.message}
                              columns="grid-cols-3"
                              options={FLOWS.map((f) => ({ value: f, label: t.quote.flows[f], Icon: FLOW_ICON[f] }))}
                            />
                          )}
                        />
                      </div>
                    )}

                    {step === 1 && (
                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        {/* origin → destination */}
                        <div className="relative grid gap-6 sm:col-span-2 sm:grid-cols-2 sm:gap-10">
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-[2.6rem] hidden size-8 -translate-x-1/2 place-items-center rounded-full bg-primary text-white sm:grid"
                          >
                            <ArrowRight className="size-4" />
                          </span>
                          <FormField id="q-origin" label={t.quote.fields.origin} required error={errors.origin?.message}>
                            <Input className="h-12" autoComplete="off" {...register("origin")} />
                          </FormField>
                          <FormField
                            id="q-destination"
                            label={t.quote.fields.destination}
                            required
                            error={errors.destination?.message}
                          >
                            <Input className="h-12" autoComplete="off" {...register("destination")} />
                          </FormField>
                        </div>
                        <Controller
                          control={control}
                          name="incoterm"
                          render={({ field }) => (
                            <FormField manual id="q-incoterm" label={t.quote.fields.incoterm} required error={errors.incoterm?.message}>
                              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                <SelectTrigger
                                  {...controlProps("q-incoterm", errors.incoterm?.message, true)}
                                  className="h-12"
                                  onBlur={field.onBlur}
                                >
                                  <SelectValue placeholder={t.quote.fields.incotermPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {INCOTERMS.map((i) => (
                                    <SelectItem key={i} value={i}>
                                      {i === "unknown" ? t.quote.unknownIncoterm : i}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormField>
                          )}
                        />
                        <Controller
                          control={control}
                          name="container"
                          render={({ field }) => (
                            <FormField manual id="q-container" label={t.quote.fields.container} error={errors.container?.message}>
                              <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v)}>
                                <SelectTrigger {...controlProps("q-container", errors.container?.message)} className="h-12">
                                  <SelectValue placeholder={t.quote.fields.containerPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {CONTAINERS.map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {t.quote.containers[c]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormField>
                          )}
                        />
                        <FormField
                          id="q-goods"
                          label={t.quote.fields.goods}
                          required
                          error={errors.goods?.message}
                          className="sm:col-span-2"
                        >
                          <Input className="h-12" placeholder={t.quote.fields.goodsPlaceholder} {...register("goods")} />
                        </FormField>
                        <div className="grid gap-4 rounded-2xl bg-secondary p-4 sm:col-span-2 sm:grid-cols-4 sm:p-5">
                          <FormField id="q-weight" label={t.quote.fields.weight} error={errors.weight?.message}>
                            <Input className="h-11 bg-white" inputMode="decimal" {...register("weight")} />
                          </FormField>
                          <FormField id="q-volume" label={t.quote.fields.volume} error={errors.volume?.message}>
                            <Input className="h-11 bg-white" inputMode="decimal" {...register("volume")} />
                          </FormField>
                          <FormField id="q-packages" label={t.quote.fields.packages} error={errors.packages?.message}>
                            <Input className="h-11 bg-white" inputMode="numeric" {...register("packages")} />
                          </FormField>
                          <FormField id="q-ready" label={t.quote.fields.readyDate} error={errors.readyDate?.message}>
                            <Input type="date" className="h-11 bg-white" {...register("readyDate")} />
                          </FormField>
                        </div>
                        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                          {(["dangerous", "temperature"] as const).map((name) => (
                            <Controller
                              key={name}
                              control={control}
                              name={name}
                              render={({ field }) => (
                                <label
                                  className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors",
                                    field.value ? "border-primary bg-primary/5" : "border-border hover:border-charcoal",
                                  )}
                                >
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(v) => field.onChange(v === true)}
                                    className="mt-0.5"
                                  />
                                  {t.quote.fields[name]}
                                </label>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <FormField id="q-name" label={t.quote.fields.fullName} required error={errors.fullName?.message}>
                          <Input className="h-12" autoComplete="name" {...register("fullName")} />
                        </FormField>
                        <FormField id="q-company" label={t.quote.fields.company} required error={errors.company?.message}>
                          <Input className="h-12" autoComplete="organization" {...register("company")} />
                        </FormField>
                        <FormField id="q-email" label={t.quote.fields.email} required error={errors.email?.message}>
                          <Input type="email" className="h-12" autoComplete="email" {...register("email")} />
                        </FormField>
                        <FormField id="q-phone" label={t.quote.fields.phone} required error={errors.phone?.message}>
                          <Input type="tel" className="h-12" autoComplete="tel" {...register("phone")} />
                        </FormField>
                        <FormField
                          id="q-message"
                          label={t.quote.fields.message}
                          error={errors.message?.message}
                          className="sm:col-span-2"
                        >
                          <Textarea rows={5} placeholder={t.quote.fields.messagePlaceholder} {...register("message")} />
                        </FormField>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="mt-8 space-y-5">
                        <p className="text-sm text-muted-foreground">{t.quote.summaryTitle}</p>
                        {[
                          {
                            title: t.quote.summarySections.service,
                            go: 0,
                            rows: [
                              [t.quote.fields.service, serviceTitle],
                              [t.quote.fields.mode, values.mode ? t.quote.modes[values.mode] : ""],
                              [t.quote.fields.flow, values.flow ? t.quote.flows[values.flow] : ""],
                            ],
                          },
                          {
                            title: t.quote.summarySections.goods,
                            go: 1,
                            rows: [
                              [t.quote.fields.origin, values.origin],
                              [t.quote.fields.destination, values.destination],
                              [t.quote.fields.incoterm, values.incoterm === "unknown" ? t.quote.unknownIncoterm : values.incoterm],
                              [t.quote.fields.goods, values.goods],
                              [t.quote.fields.container, values.container ? t.quote.containers[values.container] : ""],
                              [t.quote.fields.weight, values.weight],
                              [t.quote.fields.volume, values.volume],
                              [t.quote.fields.packages, values.packages],
                              [t.quote.fields.readyDate, values.readyDate],
                              [t.quote.fields.dangerous, yesNo(values.dangerous)],
                              [t.quote.fields.temperature, yesNo(values.temperature)],
                            ],
                          },
                          {
                            title: t.quote.summarySections.contact,
                            go: 2,
                            rows: [
                              [t.quote.fields.fullName, values.fullName],
                              [t.quote.fields.company, values.company],
                              [t.quote.fields.email, values.email],
                              [t.quote.fields.phone, values.phone],
                              [t.quote.fields.message, values.message],
                            ],
                          },
                        ].map((section, si) => (
                          <div key={section.title} className="rounded-2xl border border-border p-5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="flex items-center gap-3 font-display font-semibold">
                                <span className="grid size-7 place-items-center rounded-full bg-charcoal font-mono text-xs font-bold text-white">
                                  {si + 1}
                                </span>
                                {section.title}
                              </h3>
                              <button
                                type="button"
                                onClick={() => setStep(section.go)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-semibold text-primary transition-colors hover:border-primary"
                              >
                                <Pencil aria-hidden="true" className="size-3.5" /> {t.quote.summaryEdit}
                                <span className="sr-only">: {section.title}</span>
                              </button>
                            </div>
                            <dl className="mt-3 divide-y divide-border">
                              {section.rows.map(([label, value]) => (
                                <SummaryRow key={label} label={label ?? ""} value={value ?? ""} />
                              ))}
                            </dl>
                          </div>
                        ))}
                        <Controller
                          control={control}
                          name="consent"
                          render={({ field }) => (
                            <div>
                              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-secondary p-4 text-sm">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(v) => field.onChange(v === true)}
                                  aria-invalid={errors.consent ? true : undefined}
                                  aria-describedby={errors.consent ? "q-consent-error" : undefined}
                                  className="mt-0.5"
                                />
                                <span>
                                  {t.quote.fields.consent}{" "}
                                  <Link
                                    to="/politique-de-confidentialite"
                                    className="font-semibold text-primary underline-offset-2 hover:underline"
                                  >
                                    {t.footer.privacy}
                                  </Link>
                                </span>
                              </label>
                              {errors.consent && (
                                <p id="q-consent-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                                  {errors.consent.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? (
                    <Button type="button" variant="outline" size="lg" onClick={prev}>
                      <ArrowLeft aria-hidden="true" /> {t.common.previous}
                    </Button>
                  ) : (
                    <span />
                  )}
                  {step < total - 1 ? (
                    <Button type="button" size="lg" onClick={() => void next()}>
                      {t.common.next} <ArrowRight aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button type="submit" size="lg" disabled={formState.isSubmitting}>
                      {formState.isSubmitting ? t.quote.sending : t.quote.submit} <ArrowRight aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* live summary */}
            <div className="group relative overflow-hidden rounded-3xl bg-charcoal p-7 text-white">
              <CornerBrackets tone="light" className="absolute inset-3" />
              <CrossroadsMotif className="absolute -bottom-16 -right-16 h-56 w-56 text-white/[0.05]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">{t.quote.live.title}</h2>
                  <span className="font-mono text-xs text-white/50">{Math.round(progress)}%</span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {hasLive ? (
                  <dl className="mt-4 divide-y divide-white/10">
                    {selectedService && (
                      <LiveRow label={t.quote.fields.service}>
                        <span className="flex items-center gap-3">
                          <ServiceIcon icon={selectedService.icon} className="size-8 text-white" />
                          {selectedService.title}
                        </span>
                      </LiveRow>
                    )}
                    {(values.mode || values.flow) && (
                      <LiveRow label={`${t.quote.fields.mode} · ${t.quote.fields.flow}`}>
                        <span className="flex flex-wrap gap-1.5">
                          {values.mode && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
                              {(() => {
                                const I = MODE_ICON[values.mode];
                                return <I aria-hidden="true" className="size-3.5 text-primary" />;
                              })()}
                              {t.quote.modes[values.mode]}
                            </span>
                          )}
                          {values.flow && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
                              {(() => {
                                const I = FLOW_ICON[values.flow];
                                return <I aria-hidden="true" className="size-3.5 text-primary" />;
                              })()}
                              {t.quote.flows[values.flow]}
                            </span>
                          )}
                        </span>
                      </LiveRow>
                    )}
                    {(values.origin || values.destination) && (
                      <LiveRow label={t.quote.live.route}>
                        <span className="flex items-center gap-2">
                          <span className="truncate">{values.origin || "—"}</span>
                          <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-white/30" />
                          <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
                          <span className="truncate">{values.destination || "—"}</span>
                        </span>
                      </LiveRow>
                    )}
                    {values.goods && <LiveRow label={t.quote.fields.goods}>{values.goods}</LiveRow>}
                  </dl>
                ) : (
                  <p className="mt-5 rounded-xl border border-dashed border-white/15 p-4 text-sm text-white/55">
                    {t.quote.live.empty}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-card">
              <h2 className="font-display text-lg font-semibold">{t.quote.aside.title}</h2>
              <ul className="mt-4 space-y-3">
                {t.quote.aside.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                      <Check aria-hidden="true" className="size-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-semibold">{t.quote.aside.phone}</p>
                <ul className="mt-3 space-y-2">
                  {site.contact.phones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="group inline-flex items-center gap-3 font-display text-lg font-semibold hover:text-primary"
                      >
                        <span className="grid size-9 place-items-center rounded-full bg-secondary transition-colors group-hover:bg-primary group-hover:text-white">
                          <Phone aria-hidden="true" className="size-4" />
                        </span>
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}