import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { OrganizationJsonLd } from "@/components/site/organization-json-ld";
import { PageHero } from "@/components/site/page-hero";
import { ProcessTimeline } from "@/components/site/process-timeline";
import { Reveal } from "@/components/site/reveal";
import { ServiceIcon } from "@/components/site/service-icon";
import { getService } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} | Alliance Logistics` : "Service | Alliance Logistics" },
    { name: "description", content: loaderData?.short ?? "Solutions de transport et logistique à Casablanca." },
    { property: "og:title", content: `${loaderData?.title ?? "Service"} | Alliance Logistics` },
    { property: "og:description", content: loaderData?.short ?? "Solutions de transport et logistique." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ServicePage,
});

function ServicePage() {
  const service = Route.useLoaderData();
  return <main>
    <OrganizationJsonLd />
    <PageHero label="Nos services" title={service.title} intro={service.intro}>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild><Link to="/cotation" search={{ service: service.slug }}>Demander une cotation <ArrowRight aria-hidden="true" /></Link></Button>
        <Button asChild variant="outline"><Link to="/services">Tous les services</Link></Button>
      </div>
    </PageHero>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">
        <div><ServiceIcon icon={service.icon} className="size-16 text-charcoal" /><p className="label-caps mt-7 text-primary">Notre prise en charge</p><h2 className="mt-3 font-display text-3xl font-bold">Ce que nous prenons en charge</h2></div>
        <div className="grid gap-x-8 sm:grid-cols-2">
          {service.capabilities.map((capability, index) => <Reveal key={capability.title} delay={index * 0.035} className="border-t border-border py-5">
            <div className="flex items-start gap-3"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="font-display font-semibold">{capability.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.text}</p></div></div>
          </Reveal>)}
        </div>
      </div>
    </section>
    <section className="bg-secondary/60 py-16 lg:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="label-caps text-primary">Les étapes</p><h2 className="mt-3 font-display text-3xl font-bold">Votre opération, étape par étape</h2><ol className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{service.steps.map((step, index) => <li key={step.title} className="border-t border-border pt-5"><p className="font-display text-3xl font-bold text-primary">0{index + 1}</p><h3 className="mt-3 font-display font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p></li>)}</ol></div></section>
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><p className="label-caps text-primary">FAQ</p><h2 className="mt-3 font-display text-3xl font-bold">Questions fréquentes</h2><Accordion type="single" collapsible className="mt-6">{service.faq.map((item, index) => <AccordionItem key={item.question} value={`faq-${index}`}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{item.answer}</AccordionContent></AccordionItem>)}</Accordion></section>
    <CtaBand />
  </main>;
}