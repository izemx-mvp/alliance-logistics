/**
 * Central company information for Alliance Logistics.
 * Single source of truth for contact details, stats and certifications.
 * NOTE: items marked "placeholder" are not confirmed facts — replace before launch.
 */
export const site = {
  name: "Alliance Logistics",
  shortName: "Alliance",
  tagline: "Commissionnaire en transport international et dédouanement",
  yearsOfExperience: 45,
  generations: 2,
  url: "https://alliancebennani.com",
  contact: {
    email: "contact@alliancebennani.com",
    phones: ["+212 5 22 44 03 00", "+212 5 22 44 03 04"],
    addressLines: [
      "Rue Mohamed Smiha, Espace Paquet",
      "Angle Rue Pierre Parent, 5e et 6e étages",
      "N°505 et N°603 — Casablanca, Maroc",
    ],
    addressFull:
      "Rue Mohamed Smiha, Espace Paquet, angle Rue Pierre Parent, 5e et 6e étages, N°505 et N°603, Casablanca",
  },
  /** Placeholder number — replace with the real WhatsApp business number. */
  whatsapp: {
    number: "212600000000",
    display: "+212 6 XX XX XX XX",
    placeholder: true,
  },
  /** Placeholder profile URL — replace with the real LinkedIn page. */
  social: {
    linkedin: "#",
    linkedinPlaceholder: true,
  },
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Rue%20Mohamed%20Smiha%2C%20Casablanca%2C%20Maroc&z=16&output=embed",
  mapsLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=Rue+Mohamed+Smiha+Espace+Paquet+Casablanca",
  stats: {
    years: 45,
    agents: 600,
    team: 30,
    responseHours: 24,
  },
  certifications: [
    { label: "FIATA", detail: "Membre FIATA" },
    { label: "IATA", detail: "Membre IATA depuis 2009" },
    { label: "ISO 9001", detail: "Système de management de la qualité" },
  ],
  citiesServedNote: "Casablanca — réseau de ~600 agents dans le monde",
} as const;

export type Site = typeof site;
