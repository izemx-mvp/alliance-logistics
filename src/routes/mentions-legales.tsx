import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { site } from "@/config/site";
import { getDictionary, langFromSearch, useLang, useT, type Localized } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mentions-legales")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/mentions-legales",
      title: t.legal.seoTitle,
      description: t.legal.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.legal.title, path: "/mentions-legales" },
          ],
          lang,
        ),
      ],
    });
  },
  component: LegalNoticePage,
});

/** CONTENU EXEMPLE À REMPLACER — legal identifiers must be completed and validated. */
const SECTIONS: Localized<LegalSection[]> = {
  fr: [
    {
      heading: "Éditeur du site",
      paragraphs: [
        `${site.name} — ${site.contact.addressFull}, Maroc.`,
        `Téléphone : ${site.contact.phones.join(" / ")} — E-mail : ${site.contact.email}.`,
        "Forme juridique, capital social, RC, ICE, IF et numéro d'agrément en douane : [À COMPLÉTER].",
        "Directeur de la publication : [À COMPLÉTER].",
      ],
    },
    {
      heading: "Hébergement",
      paragraphs: ["Hébergeur du site : [À COMPLÉTER — nom, adresse et contact de l'hébergeur]."],
    },
    {
      heading: "Propriété intellectuelle",
      paragraphs: [
        `L'ensemble des contenus de ce site (textes, logo, visuels, mise en page) est la propriété de ${site.name} ou de ses partenaires. Toute reproduction sans autorisation préalable est interdite.`,
      ],
    },
    {
      heading: "Responsabilité",
      paragraphs: [
        "Les informations publiées sur ce site sont fournies à titre indicatif et ne constituent pas un engagement contractuel. Les cotations, délais et conditions sont confirmés par écrit par nos équipes pour chaque dossier.",
        "Les fonctions de suivi et d'espace client présentées dans cette version sont des démonstrations.",
      ],
    },
    {
      heading: "Données personnelles",
      paragraphs: [
        "Le traitement des données personnelles est décrit dans notre politique de confidentialité.",
      ],
    },
  ],
  en: [
    {
      heading: "Publisher",
      paragraphs: [
        `${site.name} — ${site.contact.addressFull}, Morocco.`,
        `Phone: ${site.contact.phones.join(" / ")} — Email: ${site.contact.email}.`,
        "Legal form, share capital, trade register (RC), ICE, IF and customs broker licence number: [TO BE COMPLETED].",
        "Publication director: [TO BE COMPLETED].",
      ],
    },
    {
      heading: "Hosting",
      paragraphs: ["Website host: [TO BE COMPLETED — host name, address and contact]."],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        `All content on this website (text, logo, visuals, layout) is the property of ${site.name} or its partners. Any reproduction without prior authorisation is prohibited.`,
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "Information published on this website is provided for guidance only and is not a contractual commitment. Quotes, lead times and conditions are confirmed in writing by our team for each file.",
        "The tracking and client area features in this version are demonstrations.",
      ],
    },
    {
      heading: "Personal data",
      paragraphs: ["The processing of personal data is described in our privacy policy."],
    },
  ],
};

function LegalNoticePage() {
  const t = useT();
  const lang = useLang();
  return (
    <LegalPage
      title={t.legal.title}
      updated={t.legal.updated}
      sections={SECTIONS[lang]}
      crumbLabel={t.legal.title}
    />
  );
}
