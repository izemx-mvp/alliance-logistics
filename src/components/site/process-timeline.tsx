import { Reveal } from "./reveal";

const steps = [
  { title: "Cotation", text: "Vous demandez un devis, nous répondons sous 24h maximum." },
  { title: "Ouverture de dossier", text: "Un dossier dédié est créé avec un interlocuteur unique." },
  { title: "Enlèvement", text: "Nous prenons en charge la marchandise chez l'expéditeur." },
  { title: "Expédition", text: "Départ sur l'itinéraire et le mode retenus, suivi en temps réel." },
  { title: "Dédouanement", text: "Notre agence en douane établit les formalités import/export." },
  { title: "Livraison", text: "Remise à destination, avec preuve de livraison." },
];

/** The 6-step operating process, horizontal on desktop, vertical on mobile. */
export function ProcessTimeline() {
  return (
    <ol className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-6">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 0.06} className="relative">
          {/* connector */}
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-7 top-7 hidden h-px w-[calc(100%-1rem)] border-t-2 border-dashed border-grey-soft lg:block"
            />
          )}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/25 bg-white font-display text-lg font-bold text-primary shadow-sm">
            {i + 1}
          </div>
          <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
