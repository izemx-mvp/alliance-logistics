/**
 * Partner network for /reseau.
 * CONTENU EXEMPLE À REMPLACER — the country list is an illustrative sample of
 * coverage; only the "~600 agents" figure (src/config/site.ts) is confirmed.
 */
import type { Localized } from "@/i18n";

export type Continent = "europe" | "afrique" | "moyen-orient" | "asie" | "ameriques" | "oceanie";
export type NetworkMode = "maritime" | "aerien" | "routier";

export const CONTINENTS: { id: Continent; label: Localized }[] = [
  { id: "europe", label: { fr: "Europe", en: "Europe" } },
  { id: "afrique", label: { fr: "Afrique", en: "Africa" } },
  { id: "moyen-orient", label: { fr: "Moyen-Orient", en: "Middle East" } },
  { id: "asie", label: { fr: "Asie", en: "Asia" } },
  { id: "ameriques", label: { fr: "Amériques", en: "Americas" } },
  { id: "oceanie", label: { fr: "Océanie", en: "Oceania" } },
];

export const MODE_LABELS: Record<NetworkMode, Localized> = {
  maritime: { fr: "Maritime", en: "Ocean" },
  aerien: { fr: "Aérien", en: "Air" },
  routier: { fr: "Routier", en: "Road" },
};

export type NetworkCountry = {
  code: string;
  name: Localized;
  continent: Continent;
  /** Main relay city, used for the map marker. */
  lat: number;
  lon: number;
  hubs: string[];
  modes: NetworkMode[];
};

export const HQ = { name: "Casablanca", lat: 33.57, lon: -7.59 };

export const networkCountries: NetworkCountry[] = [
  {
    code: "FR",
    name: { fr: "France", en: "France" },
    continent: "europe",
    lat: 43.3,
    lon: 5.37,
    hubs: ["Marseille", "Le Havre", "Paris"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "ES",
    name: { fr: "Espagne", en: "Spain" },
    continent: "europe",
    lat: 39.47,
    lon: -0.38,
    hubs: ["Valence", "Algésiras", "Barcelone"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "PT",
    name: { fr: "Portugal", en: "Portugal" },
    continent: "europe",
    lat: 38.72,
    lon: -9.14,
    hubs: ["Lisbonne", "Porto"],
    modes: ["maritime", "routier"],
  },
  {
    code: "IT",
    name: { fr: "Italie", en: "Italy" },
    continent: "europe",
    lat: 44.41,
    lon: 8.93,
    hubs: ["Gênes", "Milan"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "DE",
    name: { fr: "Allemagne", en: "Germany" },
    continent: "europe",
    lat: 53.55,
    lon: 9.99,
    hubs: ["Hambourg", "Francfort"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "NL",
    name: { fr: "Pays-Bas", en: "Netherlands" },
    continent: "europe",
    lat: 51.92,
    lon: 4.48,
    hubs: ["Rotterdam", "Amsterdam"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "BE",
    name: { fr: "Belgique", en: "Belgium" },
    continent: "europe",
    lat: 51.22,
    lon: 4.4,
    hubs: ["Anvers"],
    modes: ["maritime", "routier"],
  },
  {
    code: "TR",
    name: { fr: "Turquie", en: "Türkiye" },
    continent: "europe",
    lat: 41.01,
    lon: 28.98,
    hubs: ["Istanbul", "Mersin"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "SN",
    name: { fr: "Sénégal", en: "Senegal" },
    continent: "afrique",
    lat: 14.69,
    lon: -17.44,
    hubs: ["Dakar"],
    modes: ["maritime", "aerien", "routier"],
  },
  {
    code: "CI",
    name: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    continent: "afrique",
    lat: 5.36,
    lon: -4.01,
    hubs: ["Abidjan"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "MR",
    name: { fr: "Mauritanie", en: "Mauritania" },
    continent: "afrique",
    lat: 18.08,
    lon: -15.98,
    hubs: ["Nouakchott"],
    modes: ["routier", "maritime"],
  },
  {
    code: "EG",
    name: { fr: "Égypte", en: "Egypt" },
    continent: "afrique",
    lat: 31.2,
    lon: 29.92,
    hubs: ["Alexandrie", "Le Caire"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "AE",
    name: { fr: "Émirats arabes unis", en: "United Arab Emirates" },
    continent: "moyen-orient",
    lat: 25.2,
    lon: 55.27,
    hubs: ["Dubaï", "Jebel Ali"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "SA",
    name: { fr: "Arabie saoudite", en: "Saudi Arabia" },
    continent: "moyen-orient",
    lat: 21.49,
    lon: 39.19,
    hubs: ["Djeddah", "Riyad"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "CN",
    name: { fr: "Chine", en: "China" },
    continent: "asie",
    lat: 31.23,
    lon: 121.47,
    hubs: ["Shanghai", "Ningbo", "Shenzhen"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "IN",
    name: { fr: "Inde", en: "India" },
    continent: "asie",
    lat: 18.95,
    lon: 72.83,
    hubs: ["Nhava Sheva", "Mumbai"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "SG",
    name: { fr: "Singapour", en: "Singapore" },
    continent: "asie",
    lat: 1.29,
    lon: 103.85,
    hubs: ["Singapour"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "KR",
    name: { fr: "Corée du Sud", en: "South Korea" },
    continent: "asie",
    lat: 35.18,
    lon: 129.08,
    hubs: ["Busan", "Séoul"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "US",
    name: { fr: "États-Unis", en: "United States" },
    continent: "ameriques",
    lat: 40.71,
    lon: -74.0,
    hubs: ["New York", "Houston", "Miami"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "CA",
    name: { fr: "Canada", en: "Canada" },
    continent: "ameriques",
    lat: 45.5,
    lon: -73.57,
    hubs: ["Montréal"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "BR",
    name: { fr: "Brésil", en: "Brazil" },
    continent: "ameriques",
    lat: -23.96,
    lon: -46.33,
    hubs: ["Santos", "São Paulo"],
    modes: ["maritime", "aerien"],
  },
  {
    code: "AU",
    name: { fr: "Australie", en: "Australia" },
    continent: "oceanie",
    lat: -33.87,
    lon: 151.21,
    hubs: ["Sydney", "Melbourne"],
    modes: ["maritime", "aerien"],
  },
];

/**
 * Projects lat/lon into the 1000×500 viewBox of WORLD_MAP_PATH
 * (equirectangular; calibrated on the Casablanca/Shanghai/New York markers).
 */
export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: ((lon + 180) / 360) * 1000, y: 241.2 - lat * (500 / 180) };
}
