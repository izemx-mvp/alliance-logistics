/**
 * Blog posts for /actualites. CONTENU EXEMPLE À REMPLACER — editorial copy to be
 * reviewed by Alliance Logistics before launch (general guidance, not legal advice).
 */
import type { ImageKey } from "@/lib/images";
import type { Lang } from "@/i18n";

export type PostCategory = "douane" | "incoterms" | "chaine-du-froid" | "maritime";

export const POST_CATEGORIES: readonly PostCategory[] = [
  "incoterms",
  "douane",
  "chaine-du-froid",
  "maritime",
];

export type PostSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type PostText = {
  title: string;
  excerpt: string;
  sections: PostSection[];
};

export type Post = {
  slug: string;
  category: PostCategory;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  image: ImageKey;
  sample: true;
  fr: PostText;
  en: PostText;
};

export const posts: Post[] = [
  {
    slug: "incoterms-2020-bien-choisir",
    category: "incoterms",
    date: "2026-10-21",
    readingMinutes: 5,
    image: "blogIncoterms",
    sample: true,
    fr: {
      title: "Incoterms 2020 : bien choisir pour maîtriser coûts et risques",
      excerpt:
        "EXW, FOB, CIF, DAP… L'Incoterm fixe qui paie quoi et à quel moment le risque change de mains. Nos repères pour choisir en connaissance de cause.",
      sections: [
        {
          id: "role",
          heading: "À quoi sert un Incoterm ?",
          paragraphs: [
            "Les Incoterms, publiés par la Chambre de commerce internationale, sont des règles qui répartissent entre vendeur et acheteur les frais de transport, les formalités et le transfert des risques. La version en vigueur, Incoterms 2020, compte onze règles.",
            "Ils ne règlent ni le transfert de propriété ni le prix : ils précisent seulement « qui fait quoi » dans la chaîne logistique. D'où l'importance de les mentionner clairement dans le contrat et sur la facture, avec le lieu convenu.",
          ],
        },
        {
          id: "familles",
          heading: "Les grandes familles",
          paragraphs: ["On peut regrouper les règles selon le niveau d'engagement du vendeur :"],
          list: [
            "EXW : le vendeur met la marchandise à disposition dans ses locaux, l'acheteur gère tout le reste.",
            "FCA, FAS, FOB : le vendeur remet la marchandise au transporteur choisi par l'acheteur.",
            "CPT, CIP, CFR, CIF : le vendeur paie le transport principal, mais le risque passe à l'acheteur au départ.",
            "DAP, DPU, DDP : le vendeur supporte transport et risques jusqu'à destination.",
          ],
        },
        {
          id: "maritime",
          heading: "Règles maritimes ou tous modes ?",
          paragraphs: [
            "FAS, FOB, CFR et CIF sont réservés au transport maritime et fluvial. Pour un conteneur remis au terminal ou pour un envoi aérien ou routier, FCA, CPT ou CIP sont généralement plus adaptés, car le risque est transféré à la remise au transporteur.",
          ],
        },
        {
          id: "conseils",
          heading: "Nos conseils pratiques",
          paragraphs: [
            "Choisissez l'Incoterm qui correspond à votre capacité réelle à organiser le transport et le dédouanement. À l'import au Maroc, garder la main sur le transport principal (achat FOB ou FCA) permet souvent de mieux maîtriser délais et coûts, avec un commissionnaire qui coordonne l'ensemble.",
            "Nos équipes peuvent analyser vos contrats et vous recommander la règle la plus adaptée à chaque flux.",
          ],
        },
      ],
    },
    en: {
      title: "Incoterms 2020: choosing well to control costs and risks",
      excerpt:
        "EXW, FOB, CIF, DAP… The Incoterm sets who pays for what and when the risk passes. Our guidelines to choose with confidence.",
      sections: [
        {
          id: "role",
          heading: "What is an Incoterm for?",
          paragraphs: [
            "Incoterms, published by the International Chamber of Commerce, are rules that split transport costs, formalities and transfer of risk between seller and buyer. The current version, Incoterms 2020, has eleven rules.",
            "They govern neither transfer of ownership nor price: they only specify “who does what” in the supply chain. Hence the importance of stating them clearly in the contract and on the invoice, together with the named place.",
          ],
        },
        {
          id: "familles",
          heading: "The main families",
          paragraphs: ["The rules can be grouped by the seller's level of commitment:"],
          list: [
            "EXW: the seller makes the goods available at its premises; the buyer handles everything else.",
            "FCA, FAS, FOB: the seller hands the goods to the carrier chosen by the buyer.",
            "CPT, CIP, CFR, CIF: the seller pays the main carriage, but risk passes to the buyer at departure.",
            "DAP, DPU, DDP: the seller bears transport and risks up to destination.",
          ],
        },
        {
          id: "maritime",
          heading: "Sea-only rules or any mode?",
          paragraphs: [
            "FAS, FOB, CFR and CIF are reserved for sea and inland waterway transport. For a container handed over at the terminal, or for air or road shipments, FCA, CPT or CIP are usually better suited, as risk passes on handover to the carrier.",
          ],
        },
        {
          id: "conseils",
          heading: "Our practical advice",
          paragraphs: [
            "Choose the Incoterm that matches your real ability to organise transport and customs clearance. When importing into Morocco, keeping control of the main carriage (buying FOB or FCA) often gives better control of lead times and costs, with a forwarder coordinating everything.",
            "Our team can review your contracts and recommend the most suitable rule for each flow.",
          ],
        },
      ],
    },
  },
  {
    slug: "dedouanement-maroc-etapes-cles",
    category: "douane",
    date: "2026-10-07",
    readingMinutes: 6,
    image: "blogDedouanement",
    sample: true,
    fr: {
      title: "Dédouanement au Maroc : les étapes clés d'une importation",
      excerpt:
        "Documents, déclaration, contrôle, bon à enlever : le parcours d'une marchandise en douane, et les points de vigilance pour éviter les retards.",
      sections: [
        {
          id: "documents",
          heading: "Préparer le dossier documentaire",
          paragraphs: [
            "Un dédouanement fluide commence avant l'arrivée de la marchandise. Les pièces de base sont la facture commerciale, la liste de colisage et le document de transport (connaissement, LTA ou lettre de voiture).",
            "Selon la nature des produits, des certificats complémentaires peuvent être exigés : certificat d'origine pour bénéficier d'un accord préférentiel, autorisations techniques ou sanitaires, licences.",
          ],
        },
        {
          id: "declaration",
          heading: "La déclaration en douane",
          paragraphs: [
            "Le déclarant établit la déclaration unique des marchandises (DUM) sur le système informatique de la douane. Elle précise l'espèce tarifaire, la valeur, l'origine et le régime douanier demandé.",
            "Le classement tarifaire est déterminant : il conditionne les droits et taxes, mais aussi les éventuelles formalités de contrôle technique.",
          ],
        },
        {
          id: "controle",
          heading: "Contrôle et bon à enlever",
          paragraphs: [
            "Après enregistrement, la déclaration suit un circuit de contrôle : contrôle documentaire, visite physique ou mainlevée directe. Une fois les droits acquittés et le contrôle terminé, la douane délivre le bon à enlever (BAE) qui autorise la sortie de la marchandise.",
          ],
        },
        {
          id: "vigilance",
          heading: "Points de vigilance",
          paragraphs: ["Les retards les plus fréquents proviennent de causes évitables :"],
          list: [
            "Incohérences entre facture, colisage et document de transport.",
            "Classement tarifaire imprécis ou description trop vague.",
            "Autorisations préalables demandées trop tard.",
            "Original du certificat d'origine non disponible à l'arrivée.",
          ],
        },
      ],
    },
    en: {
      title: "Customs clearance in Morocco: the key steps of an import",
      excerpt:
        "Documents, declaration, inspection, release order: the journey of goods through customs, and the points to watch to avoid delays.",
      sections: [
        {
          id: "documents",
          heading: "Preparing the documents",
          paragraphs: [
            "Smooth clearance starts before the goods arrive. The basic documents are the commercial invoice, the packing list and the transport document (bill of lading, air waybill or CMR).",
            "Depending on the goods, additional certificates may be required: certificate of origin to benefit from a preferential agreement, technical or health approvals, licences.",
          ],
        },
        {
          id: "declaration",
          heading: "The customs declaration",
          paragraphs: [
            "The broker files the single goods declaration (DUM) on the customs IT system. It states the tariff classification, value, origin and requested customs procedure.",
            "Tariff classification is decisive: it determines duties and taxes, as well as any technical control formalities.",
          ],
        },
        {
          id: "controle",
          heading: "Inspection and release order",
          paragraphs: [
            "Once registered, the declaration follows a control channel: document check, physical inspection or direct release. When duties are paid and checks are complete, customs issues the release order (BAE) that allows the goods to leave.",
          ],
        },
        {
          id: "vigilance",
          heading: "Points to watch",
          paragraphs: ["The most frequent delays come from avoidable causes:"],
          list: [
            "Inconsistencies between invoice, packing list and transport document.",
            "Imprecise classification or overly vague description.",
            "Prior approvals requested too late.",
            "Original certificate of origin not available on arrival.",
          ],
        },
      ],
    },
  },
  {
    slug: "conteneur-reefer-chaine-du-froid",
    category: "chaine-du-froid",
    date: "2026-09-23",
    readingMinutes: 4,
    image: "blogReefer",
    sample: true,
    fr: {
      title: "Conteneur reefer : 5 règles pour sécuriser la chaîne du froid",
      excerpt:
        "Température de consigne, pré-refroidissement, ventilation, relevés : les bonnes pratiques pour expédier des produits sensibles sans rupture de froid.",
      sections: [
        {
          id: "consigne",
          heading: "1. Fixer la bonne consigne",
          paragraphs: [
            "Chaque produit a sa plage de température et, parfois, ses exigences d'humidité et de ventilation. La consigne doit être indiquée précisément lors de la réservation et reportée sur les documents.",
          ],
        },
        {
          id: "pre-refroidissement",
          heading: "2. Charger une marchandise déjà à température",
          paragraphs: [
            "Un conteneur reefer maintient une température, il n'est pas conçu pour refroidir rapidement une marchandise chaude. Les produits doivent être pré-refroidis avant empotage, et le conteneur pré-conditionné.",
          ],
        },
        {
          id: "empotage",
          heading: "3. Respecter l'empotage",
          paragraphs: [
            "L'air froid circule par le plancher : ne pas dépasser la ligne de charge, laisser circuler l'air et utiliser des palettes et emballages adaptés.",
          ],
        },
        {
          id: "suivi",
          heading: "4 et 5. Suivre et documenter",
          paragraphs: [
            "Les relevés de température tout au long du transport permettent de prouver le respect de la chaîne du froid. Ils doivent être remis au destinataire à la livraison et conservés.",
            "Enfin, anticipez le dédouanement : chaque heure d'attente au port compte pour une marchandise périssable.",
          ],
        },
      ],
    },
    en: {
      title: "Reefer containers: 5 rules to secure the cold chain",
      excerpt:
        "Set point, pre-cooling, ventilation, logs: best practices for shipping sensitive goods without breaking the cold chain.",
      sections: [
        {
          id: "consigne",
          heading: "1. Set the right temperature",
          paragraphs: [
            "Each product has its temperature range and sometimes humidity and ventilation requirements. The set point must be stated precisely at booking and shown on the documents.",
          ],
        },
        {
          id: "pre-refroidissement",
          heading: "2. Load goods already at temperature",
          paragraphs: [
            "A reefer container maintains a temperature; it is not designed to cool warm cargo quickly. Products must be pre-cooled before stuffing, and the container pre-conditioned.",
          ],
        },
        {
          id: "empotage",
          heading: "3. Stuff correctly",
          paragraphs: [
            "Cold air flows through the floor: do not exceed the load line, let the air circulate and use suitable pallets and packaging.",
          ],
        },
        {
          id: "suivi",
          heading: "4 & 5. Monitor and document",
          paragraphs: [
            "Temperature logs throughout transport prove the cold chain was respected. They should be handed to the consignee on delivery and kept.",
            "Finally, plan customs clearance ahead: every hour waiting at the port counts for perishable goods.",
          ],
        },
      ],
    },
  },
  {
    slug: "groupage-maritime-lcl",
    category: "maritime",
    date: "2026-09-09",
    readingMinutes: 4,
    image: "blogGroupage",
    sample: true,
    fr: {
      title: "Groupage maritime (LCL) : quand est-ce la bonne option ?",
      excerpt:
        "Vous n'avez pas de quoi remplir un conteneur ? Le groupage mutualise l'espace et les coûts. Avantages, limites et conseils pour bien l'utiliser.",
      sections: [
        {
          id: "principe",
          heading: "Le principe du groupage",
          paragraphs: [
            "En groupage (LCL, Less than Container Load), votre marchandise partage un conteneur avec celles d'autres chargeurs. Vous payez l'espace réellement utilisé, généralement calculé au mètre cube ou à la tonne.",
          ],
        },
        {
          id: "quand",
          heading: "Quand le choisir ?",
          paragraphs: ["Le groupage est pertinent dans plusieurs cas :"],
          list: [
            "Volumes réduits, typiquement quelques mètres cubes.",
            "Envois réguliers de petites quantités pour limiter les stocks.",
            "Premières commandes auprès d'un nouveau fournisseur.",
          ],
        },
        {
          id: "limites",
          heading: "Les limites à connaître",
          paragraphs: [
            "Les opérations de consolidation et de dépotage ajoutent des délais et des manipulations. Au-delà d'un certain volume, un conteneur complet (FCL) devient souvent plus économique et plus rapide.",
          ],
        },
        {
          id: "conseils",
          heading: "Nos conseils",
          paragraphs: [
            "Soignez l'emballage et le marquage des colis, et transmettez des dimensions et poids exacts. Nous comparons systématiquement groupage et complet pour vous proposer l'option la plus adaptée.",
          ],
        },
      ],
    },
    en: {
      title: "LCL sea groupage: when is it the right option?",
      excerpt:
        "Not enough to fill a container? Groupage pools space and costs. Benefits, limits and tips to use it well.",
      sections: [
        {
          id: "principe",
          heading: "How groupage works",
          paragraphs: [
            "With groupage (LCL, Less than Container Load), your goods share a container with other shippers' cargo. You pay for the space actually used, usually calculated per cubic metre or per tonne.",
          ],
        },
        {
          id: "quand",
          heading: "When to choose it?",
          paragraphs: ["Groupage makes sense in several cases:"],
          list: [
            "Small volumes, typically a few cubic metres.",
            "Regular shipments of small quantities to reduce stock.",
            "First orders with a new supplier.",
          ],
        },
        {
          id: "limites",
          heading: "Limits to be aware of",
          paragraphs: [
            "Consolidation and devanning add time and handling. Above a certain volume, a full container (FCL) is often cheaper and faster.",
          ],
        },
        {
          id: "conseils",
          heading: "Our advice",
          paragraphs: [
            "Take care with packaging and marking, and provide exact dimensions and weights. We systematically compare LCL and FCL to offer you the best option.",
          ],
        },
      ],
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postText(post: Post, lang: Lang): PostText {
  return post[lang];
}

/** Most recent first. */
export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function relatedPosts(post: Post, count = 3): Post[] {
  const others = sortedPosts().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, count);
}
