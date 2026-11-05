/**
 * Per-page SEO: title, description, Open Graph / Twitter (with og-image),
 * canonical, hreflang alternates and JSON-LD helpers.
 *
 * Usage in a route:  head: ({ match }) => pageHead({ lang: langFromSearch(match.search), path: "/contact", ... })
 */
import { site } from "@/config/site";
import type { Lang } from "@/i18n";

export const OG_IMAGE = {
  path: "/og-image.webp",
  width: 1200,
  height: 630,
  type: "image/webp",
};

type JsonLd = Record<string, unknown>;

export type PageHeadInput = {
  lang: Lang;
  /** Path without query string, e.g. "/services/agence-en-douane". */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: JsonLd[];
  /** Extra Open Graph tags for articles. */
  article?: { publishedTime: string; section: string };
};

export function absoluteUrl(path: string, lang: Lang = "fr"): string {
  const clean = path === "/" ? "/" : path.replace(/\/$/, "");
  return `${site.url}${clean}${lang === "en" ? "?lang=en" : ""}`;
}

export function pageHead(input: PageHeadInput) {
  const { lang, path, title, description, type = "website", noindex, jsonLd = [], article } = input;
  const url = absoluteUrl(path, lang);
  const image = `${site.url}${OG_IMAGE.path}`;

  const meta = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:locale", content: lang === "en" ? "en_US" : "fr_MA" },
    { property: "og:locale:alternate", content: lang === "en" ? "fr_MA" : "en_US" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: String(OG_IMAGE.width) },
    { property: "og:image:height", content: String(OG_IMAGE.height) },
    { property: "og:image:type", content: OG_IMAGE.type },
    { property: "og:image:alt", content: site.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    ...(article
      ? [
          { property: "article:published_time", content: article.publishedTime },
          { property: "article:section", content: article.section },
        ]
      : []),
  ];

  const links = [
    { rel: "canonical", href: url },
    { rel: "alternate", hrefLang: "fr", href: absoluteUrl(path, "fr") },
    { rel: "alternate", hrefLang: "en", href: absoluteUrl(path, "en") },
    { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(path, "fr") },
  ];

  return { meta, links, scripts: jsonLdScripts(jsonLd) };
}

/** JSON-LD blocks rendered by <HeadContent /> (escaped against "</script>" injection). */
export function jsonLdScripts(schemas: JsonLd[]) {
  return schemas.map((schema) => ({
    type: "application/ld+json",
    children: JSON.stringify(schema).replace(/</g, "\\u003c"),
  }));
}

/* ---------------------------- JSON-LD builders ---------------------------- */

export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/favicon.png`,
    image: `${site.url}${OG_IMAGE.path}`,
    email: site.contact.email,
    telephone: site.contact.phones[0],
    description: site.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressFull,
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
    areaServed: "Worldwide",
    memberOf: site.certifications
      .filter((c) => c.label !== "ISO 9001")
      .map((c) => ({ "@type": "Organization", name: c.label })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, lang),
    })),
  };
}

export function faqLd(faq: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function serviceLd(input: {
  name: string;
  description: string;
  path: string;
  lang: Lang;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path, input.lang),
    serviceType: input.name,
    areaServed: "Worldwide",
    provider: { "@id": `${site.url}/#organization` },
  };
}

export function blogPostingLd(input: {
  title: string;
  description: string;
  path: string;
  lang: Lang;
  datePublished: string;
  image: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path, input.lang),
    mainEntityOfPage: absoluteUrl(input.path, input.lang),
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    inLanguage: input.lang,
    image: input.image.startsWith("http") ? input.image : `${site.url}${input.image}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#organization` },
  };
}
