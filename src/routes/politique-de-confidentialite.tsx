import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { site } from "@/config/site";
import { getDictionary, langFromSearch, useLang, useT, type Localized } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/politique-de-confidentialite",
      title: t.privacy.seoTitle,
      description: t.privacy.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.privacy.title, path: "/politique-de-confidentialite" },
          ],
          lang,
        ),
      ],
    });
  },
  component: PrivacyPage,
});

/** CONTENU EXEMPLE À REMPLACER — to be validated (law 09-08 / CNDP declaration). */
const SECTIONS: Localized<LegalSection[]> = {
  fr: [
    {
      heading: "Responsable du traitement",
      paragraphs: [`${site.name}, ${site.contact.addressFull}. Contact : ${site.contact.email}.`],
    },
    {
      heading: "Données collectées",
      paragraphs: [
        "Via les formulaires de cotation et de contact : identité, société, coordonnées et informations relatives à votre expédition.",
        "Dans la version actuelle du site, ces formulaires sont des démonstrations : aucune donnée n'est transmise ni enregistrée sur un serveur.",
      ],
    },
    {
      heading: "Finalités",
      paragraphs: [
        "Répondre à vos demandes de cotation et de contact, et assurer le suivi de la relation commerciale.",
      ],
    },
    {
      heading: "Stockage local et services tiers",
      paragraphs: [
        "Votre choix de langue est conservé dans le stockage local de votre navigateur. La session de démonstration de l'espace client est conservée dans le stockage de session et supprimée à la fermeture de l'onglet.",
        "La carte Google Maps de la page Contact n'est chargée qu'à l'approche ou à la demande ; Google peut alors déposer ses propres cookies.",
      ],
    },
    {
      heading: "Vos droits",
      paragraphs: [
        `Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition. Pour l'exercer : ${site.contact.email}.`,
        "Numéro de déclaration / autorisation CNDP : [À COMPLÉTER].",
      ],
    },
  ],
  en: [
    {
      heading: "Data controller",
      paragraphs: [`${site.name}, ${site.contact.addressFull}. Contact: ${site.contact.email}.`],
    },
    {
      heading: "Data collected",
      paragraphs: [
        "Through the quote and contact forms: identity, company, contact details and information about your shipment.",
        "In the current version of the site these forms are demonstrations: no data is sent to or stored on a server.",
      ],
    },
    {
      heading: "Purposes",
      paragraphs: [
        "Answering your quote and contact requests, and managing the business relationship.",
      ],
    },
    {
      heading: "Local storage and third-party services",
      paragraphs: [
        "Your language choice is kept in your browser's local storage. The client area demo session is kept in session storage and deleted when the tab is closed.",
        "The Google Maps map on the Contact page is only loaded when approached or on request; Google may then set its own cookies.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `In accordance with Moroccan law no. 09-08 on the protection of individuals with regard to the processing of personal data, you have the right to access, rectify and object. To exercise it: ${site.contact.email}.`,
        "CNDP declaration / authorisation number: [TO BE COMPLETED].",
      ],
    },
  ],
};

function PrivacyPage() {
  const t = useT();
  const lang = useLang();
  return (
    <LegalPage
      title={t.privacy.title}
      updated={t.privacy.updated}
      sections={SECTIONS[lang]}
      crumbLabel={t.privacy.title}
    />
  );
}
