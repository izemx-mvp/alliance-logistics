import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { CrossroadsMotif } from "./motif";

/** Reusable conversion band used at the bottom of every page. */
export function CtaBand({ className }: { className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-charcoal", className)}>
      <CrossroadsMotif className="absolute -right-16 -top-16 h-72 w-72 motif-faint opacity-60" />
      <CrossroadsMotif className="absolute -bottom-24 -left-16 h-64 w-64 motif-faint opacity-40" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            Un besoin de transport ou de dédouanement ?
          </h2>
          <p className="mt-2 text-charcoal-foreground/80">
            Réponse sous <span className="font-semibold text-primary">24h maximum</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/cotation">
              Demander une cotation <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a href={`tel:${site.contact.phones[0].replace(/\s/g, "")}`}>
              <Phone className="size-4" aria-hidden="true" /> {site.contact.phones[0]}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
