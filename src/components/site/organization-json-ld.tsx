import { site } from "@/config/site";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.contact.email,
    telephone: site.contact.phones,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressFull,
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}