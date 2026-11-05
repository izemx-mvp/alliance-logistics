import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, FileText, Info, ListChecks, LogIn, Ship, Sparkles, Timer } from "lucide-react";
import logoAsset from "@/assets/alliance-logistics-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/site/form-field";
import { CornerBrackets, CrossroadsMotif } from "@/components/site/motif";
import { SiteImage } from "@/components/site/site-image";
import { site } from "@/config/site";
import { TRACKING_STEP_COUNT, shipments } from "@/data/shipments";
import { getDictionary, langFromSearch, useLang, useT } from "@/i18n";
import { signInDemo } from "@/lib/demo-session";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/espace-client/")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/espace-client",
      title: t.client.seoTitle,
      description: t.client.seoDescription,
      noindex: true,
    });
  },
  component: ClientLoginPage,
});

const POINT_ICONS = [ListChecks, Timer, FileText];
const DEMO = { email: "client.demo@example.com", password: "demo" };

/** Decorative preview of a shipment card, floating over the photo. */
function PreviewCard() {
  const t = useT();
  const lang = useLang();
  const s = shipments[0];
  if (!s) return null;
  const pct = Math.round((s.statusIndex / (TRACKING_STEP_COUNT - 1)) * 100);
  return (
    <div aria-hidden="true" className="w-72 rounded-2xl bg-white p-5 text-charcoal shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-sm font-bold tracking-wider">
          <span className="grid size-8 place-items-center rounded-lg bg-charcoal text-white">
            <Ship className="size-4" />
          </span>
          {s.reference}
        </span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
          {t.tracking.steps[s.statusIndex]}
        </span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
        {s.route.from[lang].split(",")[0]}
        <span className="h-px flex-1 border-t border-dashed border-grey" />
        {s.route.to[lang].split(",")[0]}
      </p>
      <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-secondary">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
      <p className="mt-2 text-right font-mono text-[0.65rem] text-muted-foreground">{pct}%</p>
    </div>
  );
}

function ClientLoginPage() {
  const t = useT();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t.client.errors.email),
        password: z.string().min(4, t.client.errors.password),
      }),
    [t],
  );
  const { register, handleSubmit, formState, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    signInDemo(values.email);
    void navigate({ to: "/espace-client/dossiers" });
  });

  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      <CrossroadsMotif className="absolute -right-24 -top-10 -z-10 h-[28rem] w-[28rem] motif-faint" />
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-stretch gap-8 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:pt-32">
        {/* visual panel */}
        <div className="relative hidden overflow-hidden rounded-3xl bg-charcoal text-white lg:block">
          <SiteImage image="espaceClient" priority sizes="55vw" className="absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />
          <CornerBrackets tone="light" className="absolute inset-4" />
          <div className="absolute right-8 top-10 rotate-2 transition-transform duration-500 hover:rotate-0">
            <PreviewCard />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="eyebrow text-white/70">{site.name}</p>
            <p className="mt-4 max-w-md font-display text-3xl font-bold leading-tight">{t.client.panelTitle}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {t.client.panelPoints.map((p, i) => {
                const Icon = POINT_ICONS[i] ?? ListChecks;
                return (
                  <li key={p} className="rounded-xl bg-white/10 p-4 text-sm ring-1 ring-white/10 backdrop-blur-sm">
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                    <span className="mt-2 block leading-snug text-white/90">{p}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* form */}
        <div className="flex items-center">
          <div className="group relative mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.4)] sm:p-10">
            <CornerBrackets className="absolute inset-3" />
            <img src={logoAsset} alt={site.name} width={284} height={100} className="h-10 w-auto" />
            <p className="eyebrow mt-8 text-primary">{t.client.eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{t.client.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{t.client.text}</p>

            <button
              type="button"
              onClick={() => {
                setValue("email", DEMO.email, { shouldValidate: true });
                setValue("password", DEMO.password, { shouldValidate: true });
              }}
              className="mt-6 flex w-full items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-3.5 text-left text-sm transition-colors hover:bg-primary/10"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-white">
                <Sparkles aria-hidden="true" className="size-4" />
              </span>
              <span className="flex-1 font-semibold">{t.client.demoFill}</span>
              <ArrowRight aria-hidden="true" className="size-4 text-primary" />
            </button>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <FormField id="login-email" label={t.client.email} required error={formState.errors.email?.message}>
                <Input type="email" autoComplete="email" className="h-12" {...register("email")} />
              </FormField>
              <div className="relative">
                <FormField id="login-password" label={t.client.password} required error={formState.errors.password?.message}>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-12 pr-12"
                    {...register("password")}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t.client.hidePassword : t.client.showPassword}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-[2.1rem] grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                </button>
              </div>
              <Button type="submit" size="lg" className="h-12 w-full text-base">
                <LogIn aria-hidden="true" /> {t.client.submit}
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">{t.client.forgot}</p>
            <p className="mt-4 flex gap-2 text-xs text-muted-foreground">
              <Info aria-hidden="true" className="mt-px size-3.5 shrink-0 text-primary" />
              {t.client.demoNote}
            </p>
            <p className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-sm">
              {t.client.noAccount}
              <Link to="/cotation" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                {t.client.noAccountCta} <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}