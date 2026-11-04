/**
 * The 6 services offered by Alliance Logistics.
 * Drives /services and /services/:slug. All copy is editable here.
 */

export type ServiceFaq = { question: string; answer: string };
export type ServiceCapability = { title: string; text: string };
export type ServiceStep = { title: string; text: string };

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: ServiceIconKey;
  intro: string;
  capabilities: ServiceCapability[];
  steps: ServiceStep[];
  faq: ServiceFaq[];
  ctaPrefill: { service: string; mode?: string };
};

export type ServiceIconKey =
  | "ship"
  | "plane"
  | "truck"
  | "warehouse"
  | "reefer"
  | "oversize";

export const services: Service[] = [
  {
    slug: "transport-international",
    title: "Transport international",
    short:
      "Import & export multimodal — maritime, aérien et routier — organisé porte à porte.",
    icon: "ship",
    intro:
      "Nous organisons vos flux import et export de bout en bout : choix de l'itinéraire, réservation, enlèvement, expédition, dédouanement et livraison finale. Un seul interlocuteur pilote votre dossier, quelle que soit la combinaison de modes retenue.",
    capabilities: [
      {
        title: "Maritime — FCL",
        text: "Conteneurs complets : dry 20'/40'/40'HC, open top, flat rack et reefer, sur les principales liaisons mondiales.",
      },
      {
        title: "Maritime — groupage & conventionnel",
        text: "LCL/groupage hebdomadaire, conventionnel et affrètement pour les volumes spécifiques ou les cargaisons projets.",
      },
      {
        title: "Aérien",
        text: "Solutions express et standard, avec service frigorifique aérien assuré 24h/24 pour les marchandises sensibles.",
      },
      {
        title: "Routier international",
        text: "Complet, groupage, frigorifique et tautliner vers l'Europe et les pays partenaires du Maroc.",
      },
      {
        title: "Produits pharmaceutiques",
        text: "Chaînes de température qualifiées, documents sanitaires et suivi dédié de bout en bout.",
      },
      {
        title: "Marchandises dangereuses",
        text: "Classes IMDG et IATA-DGR : classification, emballage, documentation et déclaration par des équipes formées.",
      },
      {
        title: "Logistique clé en main",
        text: "Nous prenons en charge l'intégralité de l'opération : transport, dédouanement, assurance et livraison.",
      },
    ],
    steps: [
      {
        title: "Analyse du besoin",
        text: "Étude de votre flux : marchandise, délais, budget et contraintes réglementaires.",
      },
      {
        title: "Planification & réservation",
        text: "Sélection de l'itinéraire et du mode, réservation auprès des compagnies.",
      },
      {
        title: "Enlèvement & expédition",
        text: "Enlèvement chez votre fournisseur ou client, groupage et départ.",
      },
      {
        title: "Dédouanement & livraison",
        text: "Formalités douanières à l'arrivée et livraison finale à l'adresse indiquée.",
      },
    ],
    faq: [
      {
        question: "Quels modes de transport traitez-vous ?",
        answer:
          "Maritime (FCL et groupage), aérien et routier international, seuls ou combinés en solution multimodale selon vos délais et votre budget.",
      },
      {
        question: "Gérez-vous les marchandises dangereuses ?",
        answer:
          "Oui, par des équipes formées aux classes IMDG (maritime) et IATA-DGR (aérien), de la classification jusqu'à la déclaration.",
      },
      {
        question: "Puis-je suivre mon dossier ?",
        answer:
          "Oui. Chaque dossier dispose d'un numéro de suivi accessible depuis l'espace client sur la page Suivi.",
      },
    ],
    ctaPrefill: { service: "transport-international" },
  },
  {
    slug: "agence-en-douane",
    title: "Agence en douane",
    short:
      "Dédouanement import & export : déclarations, régimes douaniers et conseil réglementaire.",
    icon: "truck",
    intro:
      "Notre agence en douane intégrée est le cœur de notre métier depuis 45 ans. Nous établissons vos déclarations en douane import et export, sécurisons vos régimes et vous conseillons sur la nomenclature tarifaire et les règles d'origine.",
    capabilities: [
      {
        title: "Déclarations import & export",
        text: "Établissement de la DUM et des déclarations associées, dans les délais réglementaires.",
      },
      {
        title: "Régimes douaniers",
        text: "Admission temporaire, transit, entrepôt, réexportation : nous sécurisons le régime adapté à votre opération.",
      },
      {
        title: "Nomenclature & origine",
        text: "Conseil sur le code tarifaire, les règles d'origine et les documents préférentiels (accords de libre-échange).",
      },
      {
        title: "Conformité documentaire",
        text: "Vérification des pièces : factures, listes de colisage, certificats, licences et autorisations.",
      },
      {
        title: "Contentieux & recours",
        text: "Assistance en cas de contestation de valeur, d'espèce ou d'origine, et suivi des recours.",
      },
      {
        title: "Conseil réglementaire",
        text: "Veille sur les évolutions de la réglementation douanière marocaine et internationale.",
      },
    ],
    steps: [
      {
        title: "Réception du dossier",
        text: "Collecte et contrôle des documents commerciaux et techniques.",
      },
      {
        title: "Établissement de la déclaration",
        text: "Saisie de la DUM : espèce, valeur, origine et régime douanier.",
      },
      {
        title: "Passage en douane",
        text: "Suivi du circuit de contrôle et gestion des éventuelles vérifications.",
      },
      {
        title: "Bon à enlever",
        text: "Obtention du BAE et transmission immédiate à la logistique.",
      },
    ],
    faq: [
      {
        question: "Êtes-vous un déclarant agréé ?",
        answer:
          "Oui, le dédouanement est notre métier historique : notre agence en douane est intégrée à l'entreprise et opère au quotidien sur le port et l'aéroport de Casablanca.",
      },
      {
        question: "Quels documents dois-je fournir ?",
        answer:
          "Facture commerciale, liste de colisage, document de transport et, selon la marchandise, certificats ou autorisations spécifiques. Nous vous accompagnons pour compléter le dossier.",
      },
      {
        question: "Combien de temps prend le dédouanement ?",
        answer:
          "Cela dépend du circuit de contrôle appliqué à votre déclaration. Nous suivons chaque dossier en temps réel et vous informons dès le bon à enlever.",
      },
    ],
    ctaPrefill: { service: "agence-en-douane" },
  },
  {
    slug: "transport-national-entreposage",
    title: "Transport national & entreposage",
    short:
      "Distribution sur tout le Maroc avec des moyens propres, et entreposage sécurisé.",
    icon: "warehouse",
    intro:
      "Nous livrons vos marchandises sur l'ensemble du territoire marocain avec nos moyens propres de transport, et mettons à votre disposition des espaces d'entreposage flexibles, de la palette au lot complet.",
    capabilities: [
      {
        title: "Distribution nationale",
        text: "Livraison sur tout le Maroc, du lot complet à la palette isolée.",
      },
      {
        title: "Moyens propres",
        text: "Flotte et matériel exploités en propre : continuité de service et maîtrise des délais.",
      },
      {
        title: "Entreposage",
        text: "Stockage court ou longue durée, zones adaptées aux produits sensibles.",
      },
      {
        title: "Gestion de stock",
        text: "Suivi des entrées/sorties, inventaires et préparation de commandes.",
      },
      {
        title: "Groupage & messagerie",
        text: "Tournées optimisées et livraisons multi-destinations.",
      },
      {
        title: "Pontage port / entrepôt",
        text: "Enlèvement au port ou à l'aéroport et stockage avant distribution.",
      },
    ],
    steps: [
      {
        title: "Réception de la marchandise",
        text: "Enlèvement au port, à l'aéroport ou chez le fournisseur.",
      },
      {
        title: "Entreposage",
        text: "Réception, contrôle et stockage dans notre entrepôt.",
      },
      {
        title: "Préparation",
        text: "Picking, emballage et groupage selon vos instructions.",
      },
      {
        title: "Livraison",
        text: "Distribution sur tout le Maroc avec preuve de livraison.",
      },
    ],
    faq: [
      {
        question: "Livrez-vous partout au Maroc ?",
        answer:
          "Oui, notre distribution couvre l'ensemble du territoire national, en complet comme en groupage.",
      },
      {
        question: "Vos moyens de transport sont-ils propres ?",
        answer:
          "Oui, c'est l'un de nos piliers : nous exploitons nos propres moyens de transport et d'entreposage, ce qui garantit la continuité de service.",
      },
      {
        question: "Peut-on stocker sur une courte durée ?",
        answer:
          "Oui, l'entreposage est possible de quelques jours à plusieurs mois, selon vos flux.",
      },
    ],
    ctaPrefill: { service: "transport-national-entreposage" },
  },
  {
    slug: "agence-maritime",
    title: "Agence maritime",
    short:
      "Consignation et représentation d'armateurs : escales, documentation et coordonnations.",
    icon: "ship",
    intro:
      "Nous représentons des armataires et armateurs à Casablanca : nous coordonnons les escales, gérons la documentation maritime et servons d'interface entre le navire, la douane et les chargeurs.",
    capabilities: [
      {
        title: "Consignation",
        text: "Représentation de l'armateur au port : formalités, escale et coordination.",
      },
      {
        title: "Documentation maritime",
        text: "Émission et gestion des connaissements (B/L) et documents de bord.",
      },
      {
        title: "Suivi d'escale",
        text: "Coordination pilote, remorquage, manutention et douane pendant l'escale.",
      },
      {
        title: "Relations chargeurs",
        text: "Interface entre l'armateur, les chargeurs et les prestataires locaux.",
      },
      {
        title: "Recouvrement & imputation",
        text: "Gestion des frais de surestaries et imputation dans les règles de l'art.",
      },
      {
        title: "Reporting armateur",
        text: "Comptes rendus d'escale et suivi budgétaire pour l'armement.",
      },
    ],
    steps: [
      {
        title: "Nomination",
        text: "Prise en charge de l'escale et des instructions de l'armateur.",
      },
      {
        title: "Préparation d'escale",
        text: "Coordination des autorités, de la manutention et de la douane.",
      },
      {
        title: "Opérations",
        text: "Suivi du chargement/déchargement et de la documentation.",
      },
      {
        title: "Clôture & reporting",
        text: "Compte rendu d'escale et clôture des dossiers.",
      },
    ],
    faq: [
      {
        question: "Sur quels ports intervenez-vous ?",
        answer:
          "Principalement sur le port de Casablanca, en coordination avec les autres ports du Royaume selon les besoins des armateurs représentés.",
      },
      {
        question: "Gérez-vous la documentation des navires ?",
        answer:
          "Oui : connaissements, manifests et documents d'escale sont établis et suivis par nos équipes.",
      },
      {
        question: "Travaillez-vous pour des armateurs étrangers ?",
        answer:
          "Oui, la consignation consiste précisément à représenter des armateurs et armataires auprès des autorités et des clients locaux.",
      },
    ],
    ctaPrefill: { service: "agence-maritime" },
  },
  {
    slug: "transport-frigorifique",
    title: "Transport frigorifique",
    short:
      "Chaîne du froid maîtrisée, maritime, aérienne et routière, pour produits sensibles et pharma.",
    icon: "reefer",
    intro:
      "Produits alimentaires, pharmaceutiques ou matières premières sensibles : nous maintenons la chaîne du froid sur toute la durée du transport, avec des conteneurs et véhicules frigorifiques contrôlés en continu.",
    capabilities: [
      {
        title: "Conteneurs reefer",
        text: "Maritime FCL reefer avec réglage et enregistrement de la température.",
      },
      {
        title: "Aérien frigorifique 24h/24",
        text: "Solution aérienne enceinte chauffée/froid disponible en continu.",
      },
      {
        title: "Routier frigorifique",
        text: "Camions frigorifiques pour l'import, l'export et la distribution nationale.",
      },
      {
        title: "Produits pharmaceutiques",
        text: "Transport qualifié, documents sanitaires et respect des GDP.",
      },
      {
        title: "Contrôles & traçabilité",
        text: "Relevés de température et traçabilité de bout en bout.",
      },
      {
        title: "Conseil emballage",
        text: "Recommandations d'emballage et de pré-conditionnement selon le produit.",
      },
    ],
    steps: [
      {
        title: "Étude du produit",
        text: "Température de consigne, durée, réglementation et emballage.",
      },
      {
        title: "Mise en froid",
        text: "Pré-conditionnement du conteneur ou du véhicule.",
      },
      {
        title: "Transport contrôlé",
        text: "Expédition avec suivi de la température et du dossier.",
      },
      {
        title: "Livraison & relevés",
        text: "Livraison avec remise des relevés de température.",
      },
    ],
    faq: [
      {
        question: "Quelles plages de température couvrez-vous ?",
        answer:
          "Des températures positives réfrigérées aux températures négatives congelées, selon le produit et le mode de transport.",
      },
      {
        question: "Traitez-vous les produits pharmaceutiques ?",
        answer:
          "Oui, avec des chaînes qualifiées, une documentation sanitaire dédiée et un suivi renforcé.",
      },
      {
        question: "Comment la température est-elle contrôlée ?",
        answer:
          "Les équipements frigorifiques enregistrent la température en continu et des relevés sont remis avec la livraison.",
      },
    ],
    ctaPrefill: { service: "transport-frigorifique", mode: "maritime" },
  },
  {
    slug: "transport-exceptionnel",
    title: "Transport exceptionnel",
    short:
      "Convois hors gabarit et chargements spéciaux : études, autorisations et pilotage.",
    icon: "oversize",
    intro:
      "Machines industrielles, équipements de chantier, transformateurs ou structures volumineuses : nous organisons les transports de hors gabarit, de l'étude de faisabilité jusqu'à la mise en place sur site.",
    capabilities: [
      {
        title: "Étude de faisabilité",
        text: "Analyse d'itinéraire, gabarits, ouvrages d'art et contraintes locales.",
      },
      {
        title: "Autorisations spéciales",
        text: "Demandes de permis de circulation et arrêtés pour convois exceptionnels.",
      },
      {
        title: "Matériel adapté",
        text: "Remorques surdimensionnées, flat rack et plateformes selon le chargement.",
      },
      {
        title: "Lestage & arrimage",
        text: "Plans d'arrimage, de levage et de sécurisation certifiés.",
      },
      {
        title: "Pilotage & escortes",
        text: "Conduite des convois avec véhicules pilotes et signalisation.",
      },
      {
        title: "Coordination multimodale",
        text: "Combinaison route, mer et manutention portuaire pour les cargaisons projets.",
      },
    ],
    steps: [
      {
        title: "Étude du projet",
        text: "Dimensions, poids, points de levage et itinéraire.",
      },
      {
        title: "Autorisations",
        text: "Obtention des permis et coordination avec les autorités.",
      },
      {
        title: "Exécution",
        text: "Chargement, convoyage et surveillance du convoi.",
      },
      {
        title: "Mise en place",
        text: "Déchargement et positionnement sur site avec relevés.",
      },
    ],
    faq: [
      {
        question: "Quels gabarits pouvez-vous transporter ?",
        answer:
          "Chaque projet est étudié au cas par cas : nous déterminons le matériel, l'itinéraire et les autorisations nécessaires à votre chargement.",
      },
      {
        question: "Faites-vous les démarches administratives ?",
        answer:
          "Oui, nous demandons les autorisations de circulation et coordonnons les escortes et véhicules pilotes.",
      },
      {
        question: "Organisez-vous aussi le transport maritime du lot ?",
        answer:
          "Oui, le volet maritime (flat rack, affrètement) est pris en charge par notre pôle transport international.",
      },
    ],
    ctaPrefill: { service: "transport-exceptionnel" },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
