import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Boxes, FileCheck2, PackageCheck, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { CountUp, HoverLift, Reveal } from "@/components/site/reveal";
import { ProcessTimeline } from "@/components/site/process-timeline";
import { ServiceIcon } from "@/components/site/service-icon";
import { TrackingTimeline } from "@/components/site/tracking-timeline";
import { WorldMap } from "@/components/site/world-map";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { shipments } from "@/data/shipments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alliance Logistics — Transport international et douane à Casablanca" },
      { name: "description", content: "Commissionnaire en transport international et dédouanement à Casablanca depuis 45 ans. Solutions maritimes, aériennes, routières et douanières." },
      { property: "og:title", content: "Alliance Logistics — Transport & douane" },
      { property: "og:description", content: "45 ans d'expertise en transport international et dédouanement à Casablanca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const advantages = [
  { icon: FileCheck2, title: "Douane intégrée", text: "Notre agence en douane suit les formalités import et export au quotidien." },
  { icon: BadgeCheck, title: "Un interlocuteur unique", text: "Un contact dédié coordonne chaque étape de votre opération." },
  { icon: ShieldCheck, title: "Coûts maîtrisés", text: "Chaque itinéraire est étudié selon vos délais et vos contraintes." },
  { icon: Boxes, title: "Moyens propres", text: "Transport national et entreposage organisés par nos équipes." },
];

function HomePage() {
  const demoShipment = shipments[0];

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-background pt-24">
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-4 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20">
          <div className="relative z-10 py-10 lg:py-16">
            <p className="label-caps text-primary">Alliance Logistics · Casablanca</p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.12] text-foreground sm:text-5xl lg:text-6xl">
              Votre commissionnaire en transport et dédouanement depuis 45 ans
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Transport multimodal import/export et formalités douanières, avec un interlocuteur unique de l’enlèvement à la livraison.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/cotation">Demander une cotation <ArrowRight aria-hidden="true" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/services">Nos services</Link></Button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {site.certifications.map((cert) => <span key={cert.label} className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{cert.label}</span>)}
            </div>
          </div>
          <div className="relative flex min-h-72 items-center lg:min-h-[480px]">
            <WorldMap className="relative z-10 w-full" />
            <div className="absolute bottom-4 left-2 z-20 max-w-xs border-l-2 border-primary bg-background/90 px-4 py-3 shadow-card backdrop-blur-sm">
              <p className="label-caps text-primary">Depuis Casablanca</p>
              <p className="mt-1 text-sm font-medium text-foreground">Un réseau de partenaires dans le monde entier</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/70" aria-label="Alliance Logistics en chiffres">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-7 px-4 py-9 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: 45, suffix: " ans", label: "d’expérience" },
            { value: 600, prefix: "~", suffix: "+", label: "agents dans le monde" },
            { value: 30, prefix: "~", suffix: "", label: "collaborateurs" },
            { value: 24, suffix: "h", label: "délai de réponse maximum" },
          ].map((item) => <div key={item.label} className="border-l-2 border-primary/30 pl-4"><p className="font-display text-3xl font-bold text-foreground"><CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} /></p><p className="mt-1 text-sm text-muted-foreground">{item.label}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="label-caps text-primary">Nos expertises</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Une logistique pensée pour vos flux</h2></div>
          <Button asChild variant="outline"><Link to="/services">Voir tous les services <ArrowRight aria-hidden="true" /></Link></Button>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => <Reveal key={service.slug} delay={index * 0.04}>
            <HoverLift className="h-full">
              <Link to="/services/$slug" params={{ slug: service.slug }} className="group flex h-full min-h-52 flex-col border-t border-border py-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <ServiceIcon icon={service.icon} className="size-11 text-charcoal" />
                <h3 className="mt-5 flex items-center justify-between gap-3 font-display text-lg font-semibold">{service.title}<ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" /></h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
              </Link>
            </HoverLift>
          </Reveal>)}
        </div>
      </section>

      <section className="bg-secondary/60 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><p className="label-caps text-primary">Notre méthode</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">De la cotation à la livraison</h2></Reveal>
          <div className="mt-10"><ProcessTimeline /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal><p className="label-caps text-primary">Pourquoi Alliance Logistics</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Une équipe engagée à chaque étape</h2></Reveal>
        <div className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * 0.05} className="border-t border-border py-6">
            <Icon className="size-7 text-primary" aria-hidden="true" /><h3 className="mt-4 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </Reveal>)}
        </div>
      </section>

      <section className="bg-charcoal py-16 text-charcoal-foreground lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="self-center"><p className="label-caps text-primary">Espace client</p><h2 className="mt-3 font-display text-3xl font-bold">Suivez vos dossiers</h2><p className="mt-4 max-w-md leading-relaxed text-charcoal-foreground/75">Retrouvez les principales étapes et documents de votre expédition depuis votre référence de dossier.</p><Button asChild className="mt-7"><Link to="/suivi">Accéder au suivi <ArrowRight aria-hidden="true" /></Link></Button></div>
          {demoShipment && <div className="border-l border-white/15 pl-6 sm:pl-8"><p className="mb-5 text-sm text-charcoal-foreground/70">Aperçu du suivi de dossier</p><TrackingTimeline shipment={demoShipment} className="grid gap-x-5 sm:grid-cols-2" /></div>}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}