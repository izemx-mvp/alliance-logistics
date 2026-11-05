import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { OrganizationJsonLd } from "@/components/site/organization-json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/config/site";

export const Route = createFileRoute("/a-propos")({
  head: () => ({ meta: [
    { title: "À propos d’Alliance Logistics | Une entreprise familiale à Casablanca" },
    { name: "description", content: "Découvrez l’histoire et les engagements d’Alliance Logistics, entreprise familiale de transport et douane à Casablanca depuis 45 ans." },
    { property: "og:title", content: "À propos | Alliance Logistics" },
    { property: "og:description", content: "Deux générations d’expertise logistique à Casablanca." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

const values = [
  ["Fiabilité", "Assurer un suivi rigoureux et une information claire à chaque étape."],
  ["Expertise", "Mettre l’expérience de nos équipes au service de vos opérations."],
  ["Proximité", "Construire une relation directe avec un interlocuteur dédié."],
  ["Engagement", "Coordonner les opérations avec soin, du départ à la livraison."],
];

function AboutPage() {
  return <main>
    <OrganizationJsonLd />
    <PageHero label="À propos" title="Une entreprise familiale, un métier de confiance" intro="Depuis 45 ans, Alliance Logistics accompagne les entreprises dans leurs opérations de transport international et de dédouanement depuis Casablanca." />
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
      <Reveal><p className="label-caps text-primary">Notre histoire</p><h2 className="mt-3 font-display text-3xl font-bold">Deux générations au service de vos échanges</h2><div className="mt-6 space-y-4 leading-relaxed text-muted-foreground"><p>Entreprise familiale casablancaise, Alliance Logistics s’est construite autour des métiers du transit, du transport et de la douane. Depuis quatre décennies et demie, nos équipes accompagnent les importateurs et exportateurs dans la gestion de leurs marchandises.</p><p>Notre connaissance des opérations locales, associée à un réseau d’environ 600 agents dans le monde, nous permet de coordonner des solutions adaptées aux besoins de chaque dossier.</p></div><Button asChild className="mt-7"><Link to="/contact">Parlons de vos besoins <ArrowRight aria-hidden="true" /></Link></Button></Reveal>
      <div className="grid content-center grid-cols-2 gap-px bg-border">{[{ number: `${site.yearsOfExperience}`, label: "ans d’expérience" }, { number: `${site.generations}`, label: "générations" }, { number: "~30", label: "collaborateurs" }, { number: "~600", label: "agents partenaires" }].map((item) => <div key={item.label} className="bg-background p-6 sm:p-8"><p className="font-display text-4xl font-bold text-primary">{item.number}</p><p className="mt-2 text-sm text-muted-foreground">{item.label}</p></div>)}</div>
    </section>
    <section className="bg-charcoal py-16 text-charcoal-foreground lg:py-20"><div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8"><div><p className="label-caps text-primary">Notre vision</p><h2 className="mt-3 font-display text-3xl font-bold">Rendre vos échanges plus simples et mieux coordonnés</h2></div><p className="max-w-2xl self-center text-lg leading-relaxed text-charcoal-foreground/75">Être un partenaire logistique de proximité, capable de réunir transport et douane autour d’un suivi clair, de conseils concrets et d’une organisation adaptée à chaque marchandise.</p></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><p className="label-caps text-primary">Nos engagements</p><h2 className="mt-3 font-display text-3xl font-bold">Les principes qui guident notre travail</h2><div className="mt-9 grid gap-x-9 sm:grid-cols-2 lg:grid-cols-4">{values.map(([title, text], index) => <Reveal key={title} delay={index * 0.05} className="border-t border-border py-5"><Check className="size-5 text-primary" aria-hidden="true"/><h3 className="mt-4 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></Reveal>)}</div></section>
    <section className="bg-secondary/60 py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="label-caps text-primary">Nos certifications</p><div className="mt-6 flex flex-wrap gap-8">{site.certifications.map((item) => <div key={item.label} className="min-w-36 border-l-2 border-primary pl-4"><p className="font-display text-xl font-bold">{item.label}</p><p className="mt-1 text-sm text-muted-foreground">{item.detail}</p></div>)}</div></div></section>
    <CtaBand />
  </main>;
}