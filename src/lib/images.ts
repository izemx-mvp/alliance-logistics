/**
 * Central registry of the site's photographs (src/assets/images, WebP).
 * Intrinsic width/height are stored so every <img> reserves its space (no CLS).
 * Alt texts are bilingual; pick with `img.alt[lang]`.
 */
import aboutOffice from "@/assets/images/about-office.webp";
import actualitesHero from "@/assets/images/actualites-hero.webp";
import bgContainerTexture from "@/assets/images/bg-container-texture.webp";
import blogDedouanement from "@/assets/images/blog-dedouanement.webp";
import blogGroupage from "@/assets/images/blog-groupage.webp";
import blogIncoterms from "@/assets/images/blog-incoterms.webp";
import blogReefer from "@/assets/images/blog-reefer.webp";
import espaceClient from "@/assets/images/espace-client.webp";
import heroPort from "@/assets/images/hero-port.webp";
import modeAerien from "@/assets/images/mode-aerien.webp";
import modeMaritime from "@/assets/images/mode-maritime.webp";
import modeRoutier from "@/assets/images/mode-routier.webp";
import reseauHero from "@/assets/images/reseau-hero.webp";
import serviceDouane from "@/assets/images/service-douane.webp";
import serviceEntreposage from "@/assets/images/service-entreposage.webp";
import serviceExceptionnel from "@/assets/images/service-exceptionnel.webp";
import serviceFrigorifique from "@/assets/images/service-frigorifique.webp";
import serviceInternational from "@/assets/images/service-international.webp";
import serviceMaritime from "@/assets/images/service-maritime.webp";
import servicesHero from "@/assets/images/services-hero.webp";
import suiviHero from "@/assets/images/suivi-hero.webp";
import type { Lang } from "@/i18n";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: Record<Lang, string>;
};

function img(src: string, width: number, height: number, fr: string, en: string): SiteImage {
  return { src, width, height, alt: { fr, en } };
}

export const images = {
  heroPort: img(
    heroPort,
    1920,
    1080,
    "Vue aérienne d'un terminal à conteneurs au lever du soleil, avec portiques de quai et porte-conteneurs à l'amarrage",
    "Aerial view of a container terminal at sunrise, with quay cranes and a berthed container ship",
  ),
  modeMaritime: img(
    modeMaritime,
    1600,
    1200,
    "Porte-conteneurs chargé en mer, illustrant le transport maritime",
    "Loaded container ship at sea, illustrating ocean freight",
  ),
  modeAerien: img(
    modeAerien,
    1600,
    1200,
    "Avion cargo en phase de chargement, illustrant le fret aérien",
    "Cargo aircraft being loaded, illustrating air freight",
  ),
  modeRoutier: img(
    modeRoutier,
    1600,
    1200,
    "Camion semi-remorque sur la route, illustrant le transport routier international",
    "Semi-trailer truck on the road, illustrating international road freight",
  ),
  aboutOffice: img(
    aboutOffice,
    1920,
    1080,
    "Salle de réunion avec carte du monde, dossiers et maquette de conteneur, vue sur Casablanca et la mosquée Hassan II",
    "Meeting room with a world map, files and a model container, overlooking Casablanca and the Hassan II mosque",
  ),
  servicesHero: img(
    servicesHero,
    1920,
    1080,
    "Plateforme multimodale au crépuscule : port à conteneurs, avion décollant et autoroute empruntée par des camions",
    "Multimodal hub at dusk: container port, departing aircraft and a highway busy with trucks",
  ),
  serviceInternational: img(
    serviceInternational,
    1920,
    1080,
    "Opérations de transport international entre port, route et aérien",
    "International freight operations across sea, road and air",
  ),
  serviceDouane: img(
    serviceDouane,
    1920,
    1080,
    "Connaissement, facture commerciale et tampon sur un bureau face au port, ordinateur ouvert sur une déclaration",
    "Bill of lading, commercial invoice and stamp on a desk facing the port, laptop open on a customs declaration",
  ),
  serviceEntreposage: img(
    serviceEntreposage,
    1920,
    1080,
    "Allée d'entrepôt aux racks chargés de palettes filmées, avec un cariste sur chariot élévateur",
    "Warehouse aisle with racks of wrapped pallets and a forklift operator",
  ),
  serviceMaritime: img(
    serviceMaritime,
    1920,
    1080,
    "Porte-conteneurs assisté d'un remorqueur lors de son accostage, amarres tendues sur le quai",
    "Container ship berthing with a tugboat, mooring lines stretched across the quay",
  ),
  serviceFrigorifique: img(
    serviceFrigorifique,
    1920,
    1080,
    "Conteneurs et équipements frigorifiques pour le transport sous température dirigée",
    "Reefer containers and equipment for temperature-controlled transport",
  ),
  serviceExceptionnel: img(
    serviceExceptionnel,
    1672,
    940,
    "Convoi exceptionnel : tracteur et remorque modulaire transportant une turbine, précédés d'un véhicule pilote",
    "Oversize convoy: tractor and modular trailer carrying a turbine, led by a pilot vehicle",
  ),
  reseauHero: img(
    reseauHero,
    1920,
    1080,
    "Globe terrestre de nuit traversé de routes lumineuses rouges reliant les continents",
    "Night-time globe crossed by glowing red routes linking the continents",
  ),
  suiviHero: img(
    suiviHero,
    1672,
    940,
    "Terminal à conteneurs de nuit, un portique soulève un conteneur rouge pendant que des camions circulent",
    "Container terminal at night, a gantry crane lifting a red container while trucks drive past",
  ),
  espaceClient: img(
    espaceClient,
    1080,
    1350,
    "Pile de conteneurs gris, blancs et rouge sous un ciel au crépuscule",
    "Stack of grey, white and red containers under a dusk sky",
  ),
  actualitesHero: img(
    actualitesHero,
    1914,
    820,
    "Quai portuaire mouillé sous un ciel brumeux, portiques et conteneurs alignés",
    "Wet port quay under a misty sky, with cranes and lined-up containers",
  ),
  blogIncoterms: img(
    blogIncoterms,
    1672,
    940,
    "Illustration d'article sur les Incoterms et la répartition des responsabilités",
    "Article illustration about Incoterms and the split of responsibilities",
  ),
  blogDedouanement: img(
    blogDedouanement,
    1672,
    940,
    "Illustration d'article sur les étapes du dédouanement au Maroc",
    "Article illustration about the customs clearance steps in Morocco",
  ),
  blogReefer: img(
    blogReefer,
    1672,
    940,
    "Illustration d'article sur le transport sous température dirigée en conteneur reefer",
    "Article illustration about temperature-controlled reefer shipping",
  ),
  blogGroupage: img(
    blogGroupage,
    1672,
    940,
    "Illustration d'article sur le groupage maritime LCL",
    "Article illustration about LCL sea groupage",
  ),
  bgContainerTexture: img(bgContainerTexture, 2520, 1080, "", ""),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
