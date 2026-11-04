import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/alliance-logo.png.asset.json";
import { site } from "@/config/site";
import { services } from "@/data/services";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-charcoal-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="inline-block rounded-lg bg-white p-3">
            <img
              src={logoAsset.url}
              alt="Alliance Logistics"
              className="h-9 w-auto"
              width={256}
              height={90}
            />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-charcoal-foreground/70">
            {site.tagline} — une entreprise familiale casablancaise depuis{" "}
            {site.yearsOfExperience} ans.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {site.certifications.map((c) => (
              <span
                key={c.label}
                title={`${c.detail} (badge de démonstration)`}
                className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-charcoal-foreground/80"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="Services">
          <h3 className="label-caps text-charcoal-foreground/60">Nos services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-charcoal-foreground/80 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Pages">
          <h3 className="label-caps text-charcoal-foreground/60">Entreprise</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/a-propos" className="text-charcoal-foreground/80 transition-colors hover:text-white">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/cotation" className="text-charcoal-foreground/80 transition-colors hover:text-white">
                Demander une cotation
              </Link>
            </li>
            <li>
              <Link to="/suivi" className="text-charcoal-foreground/80 transition-colors hover:text-white">
                Suivi de dossier
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-charcoal-foreground/80 transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
          <a
            href={site.social.linkedin}
            target={site.social.linkedin === "#" ? undefined : "_blank"}
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-charcoal-foreground/80 transition-colors hover:text-white"
            title={site.social.linkedinPlaceholder ? "Lien LinkedIn à définir" : undefined}
          >
            <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
          </a>
        </nav>

        <div>
          <h3 className="label-caps text-charcoal-foreground/60">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-charcoal-foreground/80">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            {site.contact.phones.map((phone) => (
              <li key={phone} className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-white"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-charcoal-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {site.name}. Tous droits réservés.
          </p>
          <p>Commissionnaire en transport international et en douane — Casablanca</p>
        </div>
      </div>
    </footer>
  );
}
