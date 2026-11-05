import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { OrganizationJsonLd } from "@/components/site/organization-json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ServiceIcon } from "@/components/site/service-icon";
import { services } from "@/data/services";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [
    { title: "Nos services de transport et douane | Alliance Logistics" },
    { name: "description", content: "Transport international, dédouanement, entreposage, agence maritime et solutions spécialisées à Casablanca." },
    { property: "og:title", content: "Services | Alliance Logistics" },
    { property: "og:description", content: "Découvrez nos solutions de transport, douane et logistique." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ServicesPage,
});

function ServicesPage() {
  return <main>
    <OrganizationJsonLd />
    <PageHero label="Nos expertises" title="Des solutions logistiques adaptées à vos flux" intro="Du transport international aux formalités douanières, nos équipes coordonnent chaque étape de vos opérations." />
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => <Reveal key={service.slug} delay={index * 0.04}>
          <Link to="/services/$slug" params={{ slug: service.slug }} className="group flex h-full min-h-64 flex-col border-t border-border py-7 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ServiceIcon icon={service.icon} className="size-12 text-charcoal" />
            <h2 className="mt-5 flex items-center justify-between gap-3 font-display text-xl font-semibold">{service.title}<ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" /></h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
            <span className="mt-auto pt-5 text-sm font-semibold text-primary">Découvrir le service</span>
          </Link>
        </Reveal>)}
      </div>
    </section>
    <CtaBand />
  </main>;
}